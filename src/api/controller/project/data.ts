import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import { Log } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export default async function data(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const body = req.body as { id: string };
  if (!body || !body.id) return reject({ res });
  const { id: name } = body;

  const _project = (await projectsCollection.findOne({
    name,
    _deleted: { $in: [null, false] },
  })) as ProjectTypes | null;

  if (!_project) return reject({ res, reason: "not-found" });

  const isOwner = _project.owner === validateUser.decodedToken.user_id;

  if (!_project._id) return reject({ res, reason: "not-found" });

  if (!isOwner) return reject({ res, reason: "not-owner" });

  const batchCollection = await db.collection(`batches-${_project._id}`);
  const logCollection = await db.collection(`logs-${_project._id}`);

  const batchCount = await batchCollection.countDocuments();

  const LogAggregation = await logCollection
    .aggregate(
      [
        {
          $facet: {
            logCount: [
              {
                $count: "value",
              },
            ],
            errorCount: [
              {
                $match: {
                  $or: [
                    { "options.type": "ERROR" },
                    { "options.type": "AUTO:ERROR" },
                    { "options.type": "AUTO:UNHANDLEDREJECTION" },
                  ],
                },
              },
              {
                $count: "value",
              },
            ],
            metrics: [
              {
                $match: {
                  $and: [
                    { "options.type": "METRIC" },
                    { "data.value": { $gt: 0 } },
                  ],
                },
              },
              {
                $group: {
                  _id: "$data.name",
                  value: { $avg: "$data.value" },
                },
              },
            ],
            coreInitMetrics: [
              {
                $match: {
                  $and: [
                    { "options.type": "METRIC" },
                    { "data.type": "CORE:INIT" },
                    { "data.diff": { $gt: 0 } },
                  ],
                },
              },
              {
                $group: {
                  _id: null,
                  value: { $avg: "$data.diff" },
                },
              },
            ],
            coreInitMetricsLast100: [
              {
                $match: {
                  $and: [
                    { "options.type": "METRIC" },
                    { "data.type": "CORE:INIT" },
                    { "data.diff": { $gt: 0 } },
                  ],
                },
              },
              { $limit: 100 },
              {
                $group: {
                  _id: null,
                  value: { $avg: "$data.diff" },
                },
              },
            ],
            last100: [
              {
                $match: {
                  $and: [
                    { "options.type": "METRIC" },
                    { "data.value": { $gt: 0 } },
                  ],
                },
              },
              { $limit: 100 },
              {
                $group: {
                  _id: "$data.name",
                  value: { $avg: "$data.value" },
                },
              },
            ],
            totalMetricLogs: [
              {
                $match: {
                  $and: [
                    { "options.type": "METRIC" },
                    { "data.value": { $gt: 0 } },
                  ],
                },
              },
              {
                $count: "value",
              },
            ],
            logPoolSendAllMetric: [
              {
                $match: {
                  $and: [
                    { "options.type": "METRIC" },
                    { "data.type": "LOGPOOL:SENDALL" },
                    { "data.diff": { $gt: 0 } },
                  ],
                },
              },
              {
                $group: {
                  _id: null,
                  value: { $avg: "$data.diff" },
                },
              },
            ],
            logPoolSendAllLast100Metric: [
              {
                $match: {
                  $and: [
                    { "options.type": "METRIC" },
                    { "data.type": "LOGPOOL:SENDALL" },
                    { "data.diff": { $gt: 0 } },
                  ],
                },
              },
              { $limit: 100 },
              {
                $group: {
                  _id: null,
                  value: { $avg: "$data.diff" },
                },
              },
            ],
            exceptionRate: [
              {
                $match: {
                  $or: [
                    { "options.type": "ERROR" },
                    { "options.type": "AUTO:ERROR" },
                    { "options.type": "AUTO:UNHANDLEDREJECTION" },
                  ],
                },
              },
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: {
                        $toDate: "$ts",
                      },
                    },
                  },
                  count: {
                    $sum: 1,
                  },
                },
              },
              {
                $sort: {
                  _id: 1,
                },
              },
            ],
            logRate: [
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: {
                        $toDate: "$ts",
                      },
                    },
                  },
                  count: {
                    $sum: 1,
                  },
                  // get each type of log
                  ERROR: {
                    $sum: {
                      $cond: [{ $eq: ["$options.type", "ERROR"] }, 1, 0],
                    },
                  },
                  "AUTO:ERROR": {
                    $sum: {
                      $cond: [{ $eq: ["$options.type", "AUTO:ERROR"] }, 1, 0],
                    },
                  },
                  "AUTO:UNHANDLEDREJECTION": {
                    $sum: {
                      $cond: [
                        { $eq: ["$options.type", "AUTO:UNHANDLEDREJECTION"] },
                        1,
                        0,
                      ],
                    },
                  },
                  METRIC: {
                    $sum: {
                      $cond: [{ $eq: ["$options.type", "METRIC"] }, 1, 0],
                    },
                  },
                  OTHER: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $ne: ["$options.type", "ERROR"] },
                            { $ne: ["$options.type", "AUTO:ERROR"] },
                            {
                              $ne: ["$options.type", "AUTO:UNHANDLEDREJECTION"],
                            },
                            { $ne: ["$options.type", "METRIC"] },
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },
              {
                $sort: {
                  _id: 1,
                },
              },
            ],
            lastWeekLogRate: [
              {
                $match: {
                  ts: {
                    $gte: Date.now() - 604800000,
                  },
                },
              },
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: {
                        $toDate: "$ts",
                      },
                    },
                  },
                  count: {
                    $sum: 1,
                  },
                  // get each type of log
                  ERROR: {
                    $sum: {
                      $cond: [{ $eq: ["$options.type", "ERROR"] }, 1, 0],
                    },
                  },
                  "AUTO:ERROR": {
                    $sum: {
                      $cond: [{ $eq: ["$options.type", "AUTO:ERROR"] }, 1, 0],
                    },
                  },
                  "AUTO:UNHANDLEDREJECTION": {
                    $sum: {
                      $cond: [
                        { $eq: ["$options.type", "AUTO:UNHANDLEDREJECTION"] },
                        1,
                        0,
                      ],
                    },
                  },
                  METRIC: {
                    $sum: {
                      $cond: [{ $eq: ["$options.type", "METRIC"] }, 1, 0],
                    },
                  },
                  OTHER: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $ne: ["$options.type", "ERROR"] },
                            { $ne: ["$options.type", "AUTO:ERROR"] },
                            {
                              $ne: ["$options.type", "AUTO:UNHANDLEDREJECTION"],
                            },
                            { $ne: ["$options.type", "METRIC"] },
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },
              {
                $sort: {
                  _id: 1,
                },
              },
            ],
            errorTypes: [
              {
                $match: {
                  $or: [
                    { "options.type": "ERROR" },
                    { "options.type": "AUTO:ERROR" },
                    { "options.type": "AUTO:UNHANDLEDREJECTION" },
                  ],
                },
              },
              {
                $group: {
                  _id: "$options.type",
                  count: { $sum: 1 },
                },
              },
              {
                $sort: {
                  count: -1,
                },
              },
            ],
            logPaths: [
              {
                $group: {
                  _id: "$path",
                  count: {
                    $sum: 1,
                  },
                  // get each type of log
                  ERROR: {
                    $sum: {
                      $cond: [{ $eq: ["$options.type", "ERROR"] }, 1, 0],
                    },
                  },
                  "AUTO:ERROR": {
                    $sum: {
                      $cond: [{ $eq: ["$options.type", "AUTO:ERROR"] }, 1, 0],
                    },
                  },
                  "AUTO:UNHANDLEDREJECTION": {
                    $sum: {
                      $cond: [
                        { $eq: ["$options.type", "AUTO:UNHANDLEDREJECTION"] },
                        1,
                        0,
                      ],
                    },
                  },
                  METRIC: {
                    $sum: {
                      $cond: [{ $eq: ["$options.type", "METRIC"] }, 1, 0],
                    },
                  },
                  OTHER: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $ne: ["$options.type", "ERROR"] },
                            { $ne: ["$options.type", "AUTO:ERROR"] },
                            {
                              $ne: ["$options.type", "AUTO:UNHANDLEDREJECTION"],
                            },
                            { $ne: ["$options.type", "METRIC"] },
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },
              { $sort: { count: -1 } },
            ],
          },
        },
      ],
      { allowDiskUse: true, cursor: {} }
    )
    .toArray();

  let metrics: any = {};
  let last100Metrics: any = {};
  LogAggregation[0]?.metrics?.forEach((metric: any) => {
    metrics[metric._id] = metric.value;
  });
  LogAggregation[0]?.last100?.forEach((metric: any) => {
    last100Metrics[metric._id] = metric.value;
  });

  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded)
    ? "array"
    : forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;

  Log.debug("test", ip);

  const project = {
    ip: ip || "unknown",
    name: _project.name,
    domain: _project.domain,
    _id: _project._id,
    createdAt: _project.createdAt,
    updatedAt: _project.updatedAt,
    publicKey: _project.publicKey,
    verified: _project.verified ? true : false,
    verifiedAt: _project.verifiedAt,
    localhostAccess: _project.localhostAccess ? true : false,
    logUsage: _project?.logUsage,
    logUsageLimit: _project?.logUsageLimit,
    batchCount,
    logCount: LogAggregation[0].logCount[0]?.value || 0,
    errorCount: LogAggregation[0].errorCount[0]?.value || 0,
    exceptionRate: LogAggregation[0].exceptionRate,
    logRate: LogAggregation[0].logRate,
    lastWeekLogRate: LogAggregation[0].lastWeekLogRate,
    errorTypes: LogAggregation[0].errorTypes,
    logPaths: LogAggregation[0].logPaths,
    metrics: {
      FCP: metrics["FCP"] || 0,
      LCP: metrics["LCP"] || 0,
      CLS: metrics["CLS"] || 0,
      FID: metrics["FID"] || 0,
      TTFB: metrics["TTFB"] || 0,
      CORE_INIT: LogAggregation[0]?.coreInitMetrics[0]?.value || 0,
      LOGPOOL_SENDALL: LogAggregation[0]?.logPoolSendAllMetric[0]?.value || 0,
      totalMetricLogs: LogAggregation[0]?.totalMetricLogs[0]?.value || 0,
      last100: {
        FCP: last100Metrics["FCP"] || 0,
        LCP: last100Metrics["LCP"] || 0,
        CLS: last100Metrics["CLS"] || 0,
        FID: last100Metrics["FID"] || 0,
        TTFB: last100Metrics["TTFB"] || 0,
        CORE_INIT: LogAggregation[0]?.coreInitMetricsLast100[0]?.value || 0,
        LOGPOOL_SENDALL:
          LogAggregation[0]?.logPoolSendAllLast100Metric[0]?.value || 0,
      },
    },
  };

  return accept({ res, data: project });
}
