import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

import { Log } from "@/utils/logger";
import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export async function projects(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const uid = validateUser.decodedToken.user_id;

  const _projects = await projectsCollection
    .find({
      owner: uid,
      _deleted: { $in: [null, false] },
    })
    .toArray();

  // @ts-ignore next-line
  const projects = _projects.map((project: ProjectTypes) => {
    return {
      _id: project._id,
      owner: project.owner,
      name: project.name,
      domain: project.domain,
      publicKey: project.publicKey,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  });

  return accept({ data: projects, res });
}
