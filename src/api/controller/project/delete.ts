import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";

export async function deleteproject(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const body = req.body as { id: string };
  if (!body || !body.id) return reject({ res });

  const { id } = body;

  if (!ObjectId.isValid(id) || !id) {
    return reject({ res, reason: "no-id" });
  }

  await projectsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { _deleted: true, updatedAt: Date.now() } }
  );

  return accept({ res });
}
