import { ObjectId } from "mongodb";

import { Log, formatString, formatDateToHuman, server, version } from "@/utils";
import { connectToDatabase } from "@/mongodb";
import { ValidateUser } from "./validateUser";
import { generateRandomUsername } from "@/api/utils";
import { SendTelegramMessage } from "@/utils/telegram";
import { UserTypes } from "@/types";

export interface ValidateTokenReturnType {
  success: boolean;
  error?:
    | string
    | {
        errorCode: string;
      };
  data?: any; // #TODO: define data type
}

/**
 * Validate firebase jwt token with mongodb data
 */
export async function ValidateToken({
  token,
}: {
  token?: string;
}): Promise<ValidateTokenReturnType> {
  const { db } = await connectToDatabase();
  const usersCollection = await db.collection("users");

  if (!token) return { error: "no-token", success: false };

  const validateUser = await ValidateUser({ token });

  if (validateUser && !validateUser?.decodedToken) {
    return {
      success: false,
      error: validateUser?.errorCode,
    };
  }

  let user = await usersCollection.findOne({
    uid: validateUser.decodedToken.user_id,
  });

  if (!user) {
    // register user - check and register username
    let generatedUsername = "";
    let generatedLength = 3; // Defaults to 3 characters
    let generated = false;

    while (!generated) {
      //Log.debug("validateUser:", validateUser);
      generatedUsername = formatString(
        generateRandomUsername({
          email: validateUser.decodedToken.email ?? "error",
          length: generatedLength,
        })
      ).toLowerCase();
      const checkusername = await usersCollection.findOne({
        username: generatedUsername,
      });
      if (!checkusername) generated = true;
      else {
        generatedLength++;
      }
    }

    const newUser: UserTypes = {
      email: validateUser.decodedToken.email,
      username: generatedUsername,
      uid: validateUser.decodedToken.user_id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fullname: validateUser.decodedToken.name,
      avatar: validateUser.decodedToken.picture,
      provider: validateUser.decodedToken.firebase.sign_in_provider || "",
      emailVerified: validateUser.decodedToken.email_verified,
    };

    Log.debug("USER NOT FOUND | GENERATED USER:", newUser);

    SendTelegramMessage({
      message: `REGISTER
USERNAME: @${newUser?.username}
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

    await usersCollection
      .insertOne({
        ...newUser,
      })
      .then((result) => {
        user = {
          ...newUser,
          _id: result.insertedId,
        };
      });
  } else if (user) {
    if (!user.emailVerified && validateUser?.decodedToken?.email_verified) {
      await usersCollection.updateOne(
        { _id: new ObjectId(user._id) },
        {
          $set: {
            emailVerified: true,
          },
        }
      );
      user = {
        ...user,
        emailVerified: true,
      };
    }
  }

  let data = {
    username: user?.username ?? null,
    uid: user?.uid,
    fullname: user?.fullname ?? null,
    avatar: user?.avatar ?? null,
    email: user?.email ?? null,
    emailVerified: user?.emailVerified ?? null,
  } as { [key: string]: any };

  if (user?.isAdmin) {
    data = {
      ...data,
      isAdmin: true,
    };
  }

  return {
    success: true,
    data,
  };
}
