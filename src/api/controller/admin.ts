import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";

export default async function admin(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const users = db.collection("users");

  const body = req.body as any;
  if (!body || !body.pageType) return reject({ res });

  const { pageType } = body;

  if (pageType === "users") {
    const result = await users
      .aggregate([
        { $match: { _id: { $ne: "" } } },
        {
          $facet: {
            UsersAggregate: [
              {
                $project: {
                  _id: 1,
                  uid: 1,
                  username: 1,
                  email: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  provider: 1,
                  fullname: 1,
                  emailVerified: 1,
                  avatar: 1,
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
            ],
            UsersLength: [
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ])
      .toArray();

    return accept({
      res,
      data: {
        p: pageType,
        users: result[0].UsersAggregate || [],
        usersLength: result[0].UsersLength[0]?.count || 0,
      },
    });
  } else if (pageType === "projects") {
    return accept({ res, data: { p: pageType } });
  }
}
