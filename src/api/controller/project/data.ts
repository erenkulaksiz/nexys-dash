import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export async function data(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const body = req.body as { id: string };
  if (!body || !body.id) return reject({ res });
  const { id } = body;

  const _project = (await projectsCollection.findOne({
    name: id,
    _deleted: { $in: [null, false] },
  })) as ProjectTypes | null;

  if (!_project) return reject({ res, reason: "not-found" });

  const isOwner = _project.owner === validateUser.decodedToken.user_id;

  if (!isOwner) return reject({ res, reason: "not-owner" });

  const logsCollection = await db.collection("logs");
  const logs = await logsCollection
    .find({
      project: new ObjectId(_project._id),
    })
    .toArray();

  const project = {
    name: _project.name,
    domain: _project.domain,
    _id: _project._id,
    createdAt: _project.createdAt,
    updatedAt: _project.updatedAt,
    publicKey: _project.publicKey,
    logs,
    verified: _project.verified,
    verifiedAt: _project.verifiedAt,
  };

  return accept({ res, data: project });
}
