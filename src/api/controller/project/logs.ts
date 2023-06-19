import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { Log } from "@/utils";
import { connectToDatabase } from "@/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export default async function logs(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const body = req.body as {
    id: string;
    type: string;
    page?: number;
    asc?: boolean;
    types?: string[];
    search?: string;
    path?: string;
  };
  if (!body || !body.id || !body.type) return reject({ res });
  const { id, type, page, asc, types, search, path } = body;

  if (!ObjectId.isValid(id)) return reject({ res, reason: "invalid-id" });

  const _project = (await projectsCollection.findOne({
    _id: new ObjectId(id),
    _deleted: { $in: [null, false] },
  })) as ProjectTypes | null;

  if (!_project) return reject({ res, reason: "not-found" });

  const isOwner = _project.owner === validateUser.decodedToken.user_id;

  if (!isOwner) return reject({ res, reason: "not-owner" });

  const batchCollection = await db.collection(`batches-${_project._id}`);
  const logCollection = await db.collection(`logs-${_project._id}`);

  if (type === "logs") {
    const logsLength = await logCollection.countDocuments({
      $nor: [
        { "options.type": "ERROR" },
        { "options.type": "AUTO:ERROR" },
        { "options.type": "AUTO:UNHANDLEDREJECTION" },
        { "options.type": "METRIC" },
      ],
    });

    const logs = await logCollection
      .find({
        $nor: [
          { "options.type": "ERROR" },
          { "options.type": "AUTO:ERROR" },
          { "options.type": "AUTO:UNHANDLEDREJECTION" },
          { "options.type": "METRIC" },
        ],
      })
      .sort({ ts: -1 })
      .skip(Math.floor(page ? page * 10 : 0))
      .limit(10)
      .toArray();

    return accept({ res, data: { logs, logsLength } });
  } else if (type === "batches") {
    const batchesLength = await batchCollection.countDocuments({});

    const batches = await batchCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip(Math.floor(page ? page * 10 : 0))
      .limit(10)
      .toArray();

    return accept({ res, data: { batches, batchesLength } });
  } else if (type === "exceptions") {
    const selectTypes = types?.length
      ? types?.map((type) => ({ "options.type": type }))
      : [
          { "options.type": "ERROR" },
          { "options.type": "AUTO:ERROR" },
          { "options.type": "AUTO:UNHANDLEDREJECTION" },
        ];

    const exceptionsLength = await logCollection.countDocuments({
      $or: selectTypes,
      path: path == "all" ? { $exists: true } : path,
    });

    const exceptionTypes = await logCollection
      .aggregate([
        {
          $match: {
            $or: [
              { "options.type": "ERROR" },
              { "options.type": "AUTO:ERROR" },
              { "options.type": "AUTO:UNHANDLEDREJECTION" },
            ],
            path: path == "all" ? { $exists: true } : path,
          },
        },
        {
          $group: {
            _id: "$options.type",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ])
      .toArray();

    const exceptionPaths = await logCollection
      .aggregate([
        {
          $group: {
            _id: "$path",
            count: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ["$options.type", "ERROR"] },
                      { $eq: ["$options.type", "AUTO:ERROR"] },
                      { $eq: ["$options.type", "AUTO:UNHANDLEDREJECTION"] },
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
            count: -1,
          },
        },
      ])
      .toArray();

    const exceptions = await logCollection
      .aggregate([
        {
          $match: {
            $or: selectTypes,
            path: path == "all" ? { $exists: true } : path,
          },
        },
        {
          $lookup: {
            from: `batches-${_project._id}`,
            localField: "batchId",
            foreignField: "_id",
            as: "batch",
          },
        },
        {
          $unwind: {
            path: "$batch",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            ts: asc ? 1 : -1,
          },
        },
        {
          $skip: Math.floor(page ? page * 10 : 0),
        },
        {
          $limit: 10,
        },
      ])
      .toArray();

    return accept({
      res,
      data: {
        exceptions,
        exceptionsLength,
        exceptionTypes,
        exceptionPaths,
      },
    });
  } else if (type == "batches") {
    const batchesLength = await batchCollection.countDocuments({});

    const batches = await batchCollection
      .find({})
      .sort({ ts: -1 })
      .limit(10)
      .toArray();

    return accept({ res, data: { batches, batchesLength } });
  } else if (type == "all") {
    const allLength = await logCollection.countDocuments({});

    const logs = await logCollection
      .find({})
      .sort({ ts: -1 })
      .limit(10)
      .toArray();

    return accept({ res, data: { logs, allLength } });
  }

  return reject({ res, reason: "invalid-type" });
}
