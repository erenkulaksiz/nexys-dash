import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import { LIMITS } from "@/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export async function create(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");
  const usersCollection = await db.collection("users");

  const body = req.body as ProjectTypes;
  if (!body || !body.name || !body.domain) return reject({ res });

  const { name, domain } = body;

  const user = await usersCollection.findOne({
    uid: validateUser.decodedToken.user_id,
  });

  if (!user) return reject({ res, reason: "user-not-found" });

  // Get all projects that user own
  const projects = await projectsCollection
    .find({ owner: validateUser.decodedToken.user_id })
    .count();

  // Check if user has reached the limit of projects
  if(projects >= LIMITS.MAX.RPOJECT_LENGTH){
    return reject({ res, reason: "max-projects" });
  }

  // Make sure this domain is not taken
  const domainExist = await projectsCollection.findOne({
    domain,
  });

  if (domainExist) return reject({ res, reason: "domain-exists" });

  const nameExist = await projectsCollection.findOne({
    name,
  });

  if (nameExist) return reject({ res, reason: "name-exists" });

  const generatedApiKey = randomUUID();

  const project: ProjectTypes = {
    name,
    domain,
    owner: validateUser.decodedToken.user_id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    publicKey: generatedApiKey,
    _id: new ObjectId(),
  };

  await projectsCollection.insertOne(project);

  return accept({ res });
}
