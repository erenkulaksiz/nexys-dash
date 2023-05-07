import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
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
  };

  return accept({ res, data: project });
}
