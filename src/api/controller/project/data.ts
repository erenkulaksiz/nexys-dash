import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import { Log } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";
import { getMetric } from "./metrics";
import {
  getExceptionRate,
  getLogRate,
  getLastWeekLogRate,
  getErrorTypes,
  getLogPaths,
  getCoreData,
  getLogpoolSendallMetric,
} from "./statistics";

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

  const FCPMetric = await getMetric(_project._id, "FCP");
  const LCPMetric = await getMetric(_project._id, "LCP");
  const CLSMetric = await getMetric(_project._id, "CLS");
  const FIDMetric = await getMetric(_project._id, "FID");
  const TTFBMetric = await getMetric(_project._id, "TTFB");

  const [CORE_INIT, CORE_INIT_LAST_100] = await getCoreData(_project._id);
  const [LOGPOOLMetric, LOGPOOL_LAST_100] = await getLogpoolSendallMetric(
    _project._id
  );

  // Get total amount of entries in the database for metrics
  const totalMetricLogs = await logCollection
    .find({
      $and: [{ "options.type": "METRIC" }, { "data.value": { $gt: 0 } }],
    })
    .count();

  const exceptionRate = await getExceptionRate(_project._id);
  const logRate = await getLogRate(_project._id);
  const lastWeekLogRate = await getLastWeekLogRate(_project._id);
  const errorTypes = await getErrorTypes(_project._id);
  const logPaths = await getLogPaths(_project._id);

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
    exceptionRate,
    logRate,
    lastWeekLogRate,
    errorTypes,
    logPaths,
    metrics: {
      FCP: FCPMetric[0] || 0,
      LCP: LCPMetric[0] || 0,
      CLS: CLSMetric[0] || 0,
      FID: FIDMetric[0] || 0,
      TTFB: TTFBMetric[0] || 0,
      CORE_INIT: CORE_INIT[0]?.value || 0,
      LOGPOOL_SENDALL: LOGPOOLMetric[0]?.value || 0,
      totalMetricLogs,
      last100: {
        FCP: FCPMetric[1] || 0,
        LCP: LCPMetric[1] || 0,
        CLS: CLSMetric[1] || 0,
        FID: FIDMetric[1] || 0,
        TTFB: TTFBMetric[1] || 0,
        CORE_INIT: CORE_INIT_LAST_100[0]?.value || 0,
        LOGPOOL_SENDALL: LOGPOOL_LAST_100[0]?.value || 0,
      },
    },
  };

  return accept({ res, data: project });
}
