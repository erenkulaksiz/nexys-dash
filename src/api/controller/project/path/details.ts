import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export default async function details(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const body = req.body as { id: string; path: number };
  if (!body || !body.id || !body.path) return reject({ res });

  const { id, path } = body;

  if (!ObjectId.isValid(id)) {
    return reject({ res, reason: "invalid-id" });
  }

  const _project = (await projectsCollection.findOne({
    _id: new ObjectId(id),
    _deleted: { $in: [null, false] },
  })) as ProjectTypes | null;

  if (!_project) return reject({ res, reason: "not-found" });

  const isOwner = _project.owner === validateUser.decodedToken.user_id;

  if (!_project._id) return reject({ res, reason: "not-found" });

  if (!isOwner) return reject({ res, reason: "not-owner" });

  const logCollection = await db.collection(`logs-${_project._id}`);

  const pathLogCounts = await logCollection
    .aggregate([
      {
        $match: {
          path,
        },
      },
      {
        $group: {
          _id: "$path",
          count: {
            $sum: 1,
          },
          // get each type of log
          ERROR: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ["$options.type", "ERROR"] }],
                },
                1,
                0,
              ],
            },
          },
          "AUTO:ERROR": {
            $sum: {
              $cond: [{ $eq: ["$options.type", "AUTO:ERROR"] }, 1, 0],
            },
          },
          "AUTO:UNHANDLEDREJECTION": {
            $sum: {
              $cond: [
                { $eq: ["$options.type", "AUTO:UNHANDLEDREJECTION"] },
                1,
                0,
              ],
            },
          },
          METRIC: {
            $sum: {
              $cond: [{ $eq: ["$options.type", "METRIC"] }, 1, 0],
            },
          },
          OTHER: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$options.type", "ERROR"] },
                    { $ne: ["$options.type", "AUTO:ERROR"] },
                    {
                      $ne: ["$options.type", "AUTO:UNHANDLEDREJECTION"],
                    },
                    { $ne: ["$options.type", "METRIC"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ])
    .toArray();

  return accept({
    res,
    data: {
      pathLogCounts: pathLogCounts[0] || {},
    },
  });
}
