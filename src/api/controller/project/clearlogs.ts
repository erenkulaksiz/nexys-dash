import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export default async function clearlogs(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const body = req.body as { id: string };
  if (!body || !body.id) return reject({ res });
  const { id } = body;

  if (!ObjectId.isValid(id)) {
    return reject({ res, reason: "invalid-id" });
  }

  const _project = await projectsCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!_project) return reject({ res, reason: "not-found" });

  const isOwner = _project.owner === validateUser.decodedToken.user_id;

  if (!isOwner) return reject({ res, reason: "not-owner" });

  await db.dropCollection(`logs-${id}`);

  return accept({ res });
}
