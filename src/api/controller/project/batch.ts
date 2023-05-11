import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export default async function logs(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const body = req.body as { projectId: string; id: string; page?: number };
  if (!body || !body.projectId || !body.id) return reject({ res });
  const { projectId, id, page } = body;

  const _project = (await projectsCollection.findOne({
    name: projectId,
    _deleted: { $in: [null, false] },
  })) as ProjectTypes | null;

  if (!_project) return reject({ res, reason: "not-found" });

  const isOwner = _project.owner === validateUser.decodedToken.user_id;

  if (!isOwner) return reject({ res, reason: "not-owner" });

  const batchCollection = await db.collection(`batches-${_project._id}`);
  const logCollection = await db.collection(`logs-${_project._id}`);

  if (!ObjectId.isValid(id)) return reject({ res, reason: "invalid-id" });

  const batch = await batchCollection.findOne({ _id: new ObjectId(id) });

  if (!batch) {
    return reject({ res, reason: "invalid-type" });
  }

  const logsLength = await logCollection.countDocuments({
    batchId: new ObjectId(batch._id),
  });

  const logs = await logCollection
    .find({ batchId: new ObjectId(batch._id) })
    .sort({ ts: -1 })
    .skip(Math.floor(page ? page * 10 : 0))
    .limit(10)
    .toArray();

  return accept({ res, data: { ...batch, logs, logsLength } });
}
