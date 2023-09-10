import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { Log } from "@/utils";
import { connectToDatabase } from "@/mongodb";
import { LIMITS } from "@/constants";

export default async function filteredExceptions({
  body,
  project,
  res,
}: {
  body: any;
  project?: ObjectId;
  res: any;
}) {
  const {
    page,
    filters: { asc, types, search, path, batchVersion, configUser },
  } = body;
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);
  const batchCollection = await db.collection(`batches-${project}`);

  if (search?.length > LIMITS.MAX.PROJECT_LOG_SEARCH_TEXT_LENGTH) {
    return reject({ res, reason: "search-maxlength" });
  }

  const selectTypes = types?.length
    ? types?.map((type: any) => ({ "options.type": type }))
    : [
        { "options.type": "ERROR" },
        { "options.type": "AUTO:ERROR" },
        { "options.type": "AUTO:UNHANDLEDREJECTION" },
      ];

  const exceptionUserMatch = {
    "batch.config.user": configUser,
  };

  const exceptionVersionMatch = {
    "batch.config.appVersion": batchVersion,
  };

  let exceptionMatch = {};

  if (configUser != "all" || batchVersion != "all") {
    if (configUser != "all" && batchVersion != "all") {
      exceptionMatch = {
        $and: [exceptionUserMatch, exceptionVersionMatch],
      };
    } else if (configUser != "all") {
      exceptionMatch = exceptionUserMatch;
    } else if (batchVersion != "all") {
      exceptionMatch = exceptionVersionMatch;
    }
  }

  const exceptions = await logCollection
    .aggregate(
      [
        !search || search?.length == 0
          ? {
              $match: {},
            }
          : {
              $match: {
                $text: {
                  $search: search,
                },
              },
            },
        {
          $match: {
            $or: selectTypes,
            path: path == "all" ? { $exists: true } : path,
          },
        },
        {
          $lookup: {
            from: `batches-${project}`,
            localField: "batchId",
            foreignField: "_id",
            as: "batch",
          },
        },
        {
          $unwind: {
            path: "$batch",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: exceptionMatch,
        },
        {
          $facet: {
            paginatedResults: [
              { $skip: Math.floor(page ? page * 10 : 0) },
              { $limit: 10 },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
            paths: [
              {
                $group: {
                  _id: "$path",
                  count: {
                    $sum: {
                      $cond: [
                        {
                          $or: [
                            { $eq: ["$options.type", "ERROR"] },
                            { $eq: ["$options.type", "AUTO:ERROR"] },
                            {
                              $eq: ["$options.type", "AUTO:UNHANDLEDREJECTION"],
                            },
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
                  count: -1,
                },
              },
            ],
            batchConfigUsers: [
              {
                $match: {
                  "batch.config.user": { $exists: true, $ne: "" },
                },
              },
              {
                $group: {
                  _id: "$batch.config.user",
                  count: { $sum: 1 },
                },
              },
              {
                $sort: {
                  count: -1,
                },
              },
            ],
            exceptionTypes: [
              {
                $match: {
                  $or: [
                    { "options.type": "ERROR" },
                    { "options.type": "AUTO:ERROR" },
                    { "options.type": "AUTO:UNHANDLEDREJECTION" },
                  ],
                  path: path == "all" ? { $exists: true } : path,
                },
              },
              {
                $match: exceptionMatch,
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
          },
        },
        {
          $sort: {
            ts: asc ? 1 : -1,
          },
        },
      ],
      { allowDiskUse: true, cursor: {} }
    )
    .toArray();

  const batchVersions = await batchCollection
    .aggregate(
      [
        {
          $match: {
            "config.appVersion": { $exists: true },
          },
        },
        {
          $group: {
            _id: "$config.appVersion",
            count: { $sum: 1 },
            ERROR: {
              $sum: "$logTypes.ERROR",
            },
            "AUTO:ERROR": {
              $sum: "$logTypes.AUTO:ERROR",
            },
            "AUTO:UNHANDLEDREJECTION": {
              $sum: "$logTypes.AUTO:UNHANDLEDREJECTION",
            },
            METRIC: {
              $sum: "$logTypes.METRIC",
            },
            OTHER: {
              $sum: "$logTypes.undefined",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ],
      { allowDiskUse: true, cursor: {} }
    )
    .toArray();

  return accept({
    res,
    data: {
      exceptions: exceptions[0]?.paginatedResults || [],
      exceptionsLength: exceptions[0]?.totalCount[0]?.count || 0,
      exceptionTypes: exceptions[0]?.exceptionTypes || [],
      exceptionPaths: exceptions[0]?.paths || [],
      batchConfigUsers: exceptions[0]?.batchConfigUsers || [],
      batchVersions: batchVersions || [],
    },
  });
}
