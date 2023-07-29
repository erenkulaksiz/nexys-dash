import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";

export default async function filteredExceptions({
  body,
  project,
  res,
}: {
  body: any;
  project?: ObjectId;
  res: any;
}) {
  const { page, asc, types, path, batchVersion, configUser } = body;
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);
  const batchCollection = await db.collection(`batches-${project}`);

  const selectTypes = types?.length
    ? types?.map((type: any) => ({ "options.type": type }))
    : [
        { "options.type": "ERROR" },
        { "options.type": "AUTO:ERROR" },
        { "options.type": "AUTO:UNHANDLEDREJECTION" },
      ];

  const exceptionsLength = await logCollection
    .aggregate([
      {
        $match: {
          $or: selectTypes,
          path: path == "all" ? { $exists: true } : path,
        },
      },
      {
        $lookup: {
          from: `batches-${project}`,
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
        $match: {
          "batch.config.appVersion":
            batchVersion == "all" ? { $exists: true } : batchVersion,
          //"batch.config.user":
          //configUser == "all" ? { $exists: true } : configUser,
        },
      },
      {
        $count: "count",
      },
    ])
    .toArray();

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
        $lookup: {
          from: `batches-${project}`,
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
        $match: {
          "batch.config.appVersion":
            batchVersion == "all" ? { $exists: true } : batchVersion,
          //"batch.config.user":
          //configUser == "all" ? { $exists: true } : configUser,
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
          from: `batches-${project}`,
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
        $match: {
          "batch.config.appVersion":
            batchVersion == "all" ? { $exists: true } : batchVersion,
          //"batch.config.user":
          //configUser == "all" ? { $exists: true } : configUser,
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

  const batchConfigUsers = await batchCollection
    .aggregate([
      {
        $match: {
          "config.user": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$config.user",
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

  const batchVersions = await batchCollection
    .aggregate([
      {
        $match: {
          "config.appVersion": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$config.appVersion",
          count: { $sum: 1 },
          ERROR: {
            $sum: "$logTypes.ERROR",
          },
          "AUTO:ERROR": {
            $sum: "$logTypes.AUTO:ERROR",
          },
          "AUTO:UNHANDLEDREJECTION": {
            $sum: "$logTypes.AUTO:UNHANDLEDREJECTION",
          },
          METRIC: {
            $sum: "$logTypes.METRIC",
          },
          OTHER: {
            $sum: "$logTypes.undefined",
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ])
    .toArray();

  return accept({
    res,
    data: {
      exceptions,
      exceptionsLength: exceptionsLength[0]?.count || 0,
      exceptionTypes,
      exceptionPaths,
      batchConfigUsers,
      batchVersions,
    },
  });
}
