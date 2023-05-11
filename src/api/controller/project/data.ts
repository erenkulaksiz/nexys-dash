import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import { Log } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";
import {
  getCLSMetric,
  getFCPMetric,
  getFIDMetric,
  getLCPMetric,
  getTTFBMetric,
} from "./metrics";

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
    name: name,
    _deleted: { $in: [null, false] },
  })) as ProjectTypes | null;

  if (!_project) return reject({ res, reason: "not-found" });

  const isOwner = _project.owner === validateUser.decodedToken.user_id;

  if (!isOwner) return reject({ res, reason: "not-owner" });

  const batchCollection = await db.collection(`batches-${_project._id}`);
  const logCollection = await db.collection(`logs-${_project._id}`);

  const batchCount = await batchCollection.countDocuments();
  const logCount = await logCollection.countDocuments();

  const errorCount = await logCollection
    .find({
      $or: [
        { "options.type": "ERROR" },
        { "options.type": "AUTO:ERROR" },
        { "options.type": "AUTO:UNHANDLEDREJECTION" },
      ],
    })
    .count();

  const FCPMetric = await getFCPMetric(_project._id ?? null);
  const LCPMetric = await getLCPMetric(_project._id ?? null);
  const CLSMetric = await getCLSMetric(_project._id ?? null);
  const FIDMetric = await getFIDMetric(_project._id ?? null);
  const TTFBMetric = await getTTFBMetric(_project._id ?? null);

  const FCPLast100Metric = await getFCPMetric(_project._id ?? null, 100);
  const LCPLast100Metric = await getLCPMetric(_project._id ?? null, 100);
  const CLSLast100Metric = await getCLSMetric(_project._id ?? null, 100);
  const FIDLast100Metric = await getFIDMetric(_project._id ?? null, 100);
  const TTFBLast100Metric = await getTTFBMetric(_project._id ?? null, 100);

  // Get total amount of entries in the database for metrics
  const totalMetricLogs = await logCollection
    .find({
      $and: [{ "options.type": "METRIC" }, { "data.value": { $gt: 0 } }],
    })
    .count();

  /*
  const dayErrors = await logCollection
    .aggregate([
      {
        $group: {
          _id: "$_id",
          ts: { $first: { $toDate: "$ts" } },
        },
      },
    ])
    .toArray();

  Log.debug("DAY errors", dayErrors);
  */

  const project = {
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
    logCount,
    errorCount,
    metrics: {
      FCP: FCPMetric[0]?.FCP || 0,
      LCP: LCPMetric[0]?.LCP || 0,
      CLS: CLSMetric[0]?.CLS || 0,
      FID: FIDMetric[0]?.FID || 0,
      TTFB: TTFBMetric[0]?.TTFB || 0,
      totalMetricLogs,
      last100: {
        FCP: FCPLast100Metric[0]?.FCP || 0,
        LCP: LCPLast100Metric[0]?.LCP || 0,
        CLS: CLSLast100Metric[0]?.CLS || 0,
        FID: FIDLast100Metric[0]?.FID || 0,
        TTFB: TTFBLast100Metric[0]?.TTFB || 0,
      },
    },
  };

  return accept({ res, data: project });
}
