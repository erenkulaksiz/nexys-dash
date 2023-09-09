import { NextApiRequest, NextApiResponse } from "next";

import { getTokenFromHeader } from "@/utils/api/getTokenFromHeader";
import { ValidateUser, ValidateUserReturnType } from "@/utils/api/validateUser";
import { Log } from "@/utils";
import { connectToDatabase } from "@/mongodb";
import { ObjectId } from "mongodb";

interface acceptProps {
  data?: any;
  status?: number;
  action?: string;
  res: NextApiResponse;
}

interface rejectProps {
  reason?: string;
  status?: number;
  res: NextApiResponse;
}

export function accept({
  data,
  status = 200,
  action = "defaultAction",
  res,
}: acceptProps) {
  Log.debug("accept: ", /*data,*/ status, action);
  if (data) {
    return res.status(status).json({ data });
  }
  return res.status(status).send(null);
}

export function reject({
  reason = "invalid-params",
  status = 400,
  res,
}: rejectProps) {
  Log.debug("reject: ", reason);
  res.status(status).json({ error: reason });
}

export function generateRandomUsername({
  email,
  length,
}: {
  email: string;
  length: number;
}) {
  const now = Date.now().toString();
  return (
    email.split("@")[0].substring(0, 10) + now.substring(now.length - length)
  );
}

/**
 * check whether user is authenticated or not
 */
export async function checkUserAuth({
  req,
  res,
  func,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  func: (
    req: NextApiRequest,
    res: NextApiResponse<any>,
    validateUser: ValidateUserReturnType
  ) => Promise<void>;
}): Promise<void> {
  const { body } = req;
  if (!body && !body.uid) return reject({ res, reason: "no-auth-params" }); // assuming all auth routes have uid in body
  const { uid } = body;
  const bearer = getTokenFromHeader(req);
  if (!bearer) return reject({ res, reason: "no-auth" });
  const validateUser = await ValidateUser({ token: bearer });
  //Log.debug("validateUser: ", validateUser);
  if (validateUser && !validateUser.decodedToken)
    return reject({ reason: validateUser.errorCode, res });
  if (validateUser.decodedToken.uid !== uid)
    return reject({ res, reason: "auth-uid-error" });

  return func(req, res, validateUser);
}

export async function createSearchIndex(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  await logCollection.createIndex({ "data.message": "text", path: "text" });
  Log.debug("Created search index!");
}

export async function createIndex(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);
  const batchCollection = await db.collection(`batches-${project}`);
  const usersCollection = await db.collection(`users-${project}`);

  await logCollection.createIndex({
    "options.type": 1,
    "data.value": 1,
    "options.action": 1,
    ts: 1,
  });
  await batchCollection.createIndex({
    "config.appVersion": 1,
    "config.user": "text",
  });
  await usersCollection.createIndex({ email: 1, username: 1, uid: 1 });
  Log.debug("Created indexes!");
}
