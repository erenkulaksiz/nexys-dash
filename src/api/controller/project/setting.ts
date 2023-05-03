import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { Log } from "@/utils";
import { connectToDatabase } from "@/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export async function setting(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const body = req.body as { id: string; localhostAccess: boolean };
  if (!body || !body.id || body.localhostAccess == null) return reject({ res });

  const { id, localhostAccess } = body;

  if (!ObjectId.isValid(id) || !id) {
    return reject({ res, reason: "no-id" });
  }

  const _project = (await projectsCollection.findOne({
    _id: new ObjectId(id),
    _deleted: { $in: [null, false] },
  })) as ProjectTypes | null;

  if (!_project) return reject({ res, reason: "not-found" });

  const isOwner = _project.owner === validateUser.decodedToken.user_id;

  if (!isOwner) return reject({ res, reason: "not-owner" });

  await projectsCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        localhostAccess: localhostAccess ? true : false,
      },
    }
  );

  Log.debug("Project setting", _project, localhostAccess);

  return accept({ res });
}
