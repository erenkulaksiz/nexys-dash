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
  const { page, asc, types, path } = body;
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
    ])
    .toArray();

  const batchVersions = await batchCollection
    .aggregate([
      {
        $match: {
          "config.appVersion": { $exists: true },
        },
      },
      /*
      {
        $lookup: {
          from: `logs-${project}`,
          localField: "_id",
          foreignField: "batchId",
          as: "log",
        },
      },
      {
        $unwind: {
          path: "$log",
          preserveNullAndEmptyArrays: true,
        },
      },
      */
      {
        $group: {
          _id: "$config.appVersion",
          count: { $sum: 1 },
          ERROR: {
            $sum: {
              $cond: [{ $eq: ["$options.type", "ERROR"] }, 1, 0],
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
          _id: -1,
        },
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
      batchConfigUsers,
      batchVersions,
    },
  });
}
