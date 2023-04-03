import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import { connectToDatabase } from "@/mongodb";
import { accept, reject } from "@/api/utils";
import { LIMITS } from "@/constants";
import * as admin from "firebase-admin";
import { Log, formatString } from "@/utils";
import { generateRandomUsername } from "@/api/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import type { UserTypes } from "@/types";

import { sendEmailVerification } from "firebase/auth";

const googleService = JSON.parse(process.env.GOOGLE_SERVICE || "");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(googleService),
  });
}

export async function signup(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const usersCollection = await db.collection("users");
  const auth = await admin.auth();

  const { body } = req;
  if (!body || !body.email || !body.password || !body.username)
    return reject({ res });
  const { email, password, username } = body;
  if (email.length == 0 || password.length == 0 || username.length == 0)
    return reject({ res });

  if (email.length > LIMITS.MAX.EMAIL_CHARACTER_LENGTH)
    return reject({ reason: "email-maxlength", res });
  if (email.length < LIMITS.MIN.EMAIL_CHARACTER_LENGTH)
    return reject({ reason: "email-minlength", res });

  if (password.length > LIMITS.MAX.PASSWORD_CHARACTER_LENGTH)
    return reject({ reason: "password-maxlength", res });
  if (password.length < LIMITS.MIN.PASSWORD_CHARACTER_LENGTH)
    return reject({ reason: "password-minlength", res });

  if (username.length > LIMITS.MAX.USERNAME_CHARACTER_LENGTH)
    return reject({ reason: "username-maxlength", res });
  if (username.length < LIMITS.MIN.USERNAME_CHARACTER_LENGTH)
    return reject({ reason: "username-minlength", res });

  const user = await usersCollection
    .find({ email })
    .toArray()
    .then((users) => users[0]);

  if (user) return reject({ reason: "email-exists", res });

  const usernameCheck = await usersCollection
    .find({
      username: formatString(username).toLowerCase(),
    })
    .toArray()
    .then((users) => users[0]);

  if (usernameCheck) return reject({ reason: "username-exists", res });

  const create = await auth
    .createUser({
      email,
      password,
    })
    .catch((err) => {
      Log.error("signup error:", err);
      if (err.code == "auth/email-already-exists")
        return reject({ reason: "email-exists", res });
    });

  if (!create) return reject({ reason: "create-failed", res });

  const newUser = {
    email,
    username,
    uid: create.uid,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    provider: "email",
    emailVerified: false,
  } as UserTypes;

  const insert = await usersCollection.insertOne(newUser);

  if (!insert) return reject({ reason: "insert-failed", res });

  return accept({ res });
}
