import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

import { SendTelegramMessage } from "@/utils/telegram";
import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import { LIMITS } from "@/constants";
import { formatDateToHuman, version, server } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export default async function create(
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
  if (projects >= LIMITS.MAX.PROJECT_LENGTH) {
    return reject({ res, reason: "max-projects" });
  }

  if (domain.length > LIMITS.MAX.PROJECT_DOMAIN_CHARACTER_LENGTH) {
    return reject({ res, reason: "max-domain-length" });
  }

  if (domain.includes(" ")) {
    return reject({ res, reason: "domain-invalid" });
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
    verified: false,
    verifiedAt: 0,
    localhostAccess: false,
    logUsage: 0,
    logUsageLimit: LIMITS.MAX.LOG_USAGE_LIMIT,
    plan: "free",
    planExpireAt: 0,
    telegram: {
      botId: "",
      targetId: "",
    },
  };

  const { insertedId } = await projectsCollection.insertOne(project);

  await db.createCollection(`logs-${insertedId}`);
  await db.createCollection(`batches-${insertedId}`);

  // create indexes
  const logCollection = await db.collection(`logs-${insertedId}`);
  const batchCollection = await db.collection(`batches-${insertedId}`);
  await logCollection.createIndex({
    ts: 1,
    batchId: 1,
    "data.message": "text",
    path: "text",
    "options.type": 1,
    "options.action": 1,
    "data.value": 1,
  });
  await batchCollection.createIndex({
    "config.appVersion": 1,
    "config.user": "text",
    "config.platform": 1,
  });

  await SendTelegramMessage({
    message: `PROJECT CREATED
NAME: ${project.name}
DOMAIN: ${project.domain}
USERNAME: @${user?.username}
EMAIL: ${validateUser.decodedToken.email}
UID: ${validateUser.decodedToken.user_id}
TIME: ${formatDateToHuman({
      date: Date.now(),
      output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
    })}
TS: ${Date.now()}
URL: ${server}
ENV: ${process.env.NODE_ENV}
VER: ${version}
PROVIDER: ${validateUser.decodedToken.firebase.sign_in_provider}
PLATFORM: web`,
  });

  return accept({ res });
}
