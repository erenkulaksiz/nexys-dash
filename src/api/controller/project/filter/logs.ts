import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";

export default async function filteredLogs({
  body,
  project,
  res,
  page,
}: {
  project?: ObjectId;
  res: any;
  page?: number;
  body: any;
}) {
  const {
    filters: { asc, path, action },
  } = body;
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  const logActions = await logCollection
    .aggregate(
      [
        {
          $match: {
            $nor: [
              { "options.type": "ERROR" },
              { "options.type": "AUTO:ERROR" },
              { "options.type": "AUTO:UNHANDLEDREJECTION" },
              { "options.type": "METRIC" },
            ],
          },
        },
        {
          $group: {
            _id: "$options.action",
            count: { $sum: 1 },
            pathes: { $addToSet: "$path" },
          },
        },
        {
          $sort: { count: -1 },
        },
      ],
      { allowDiskUse: true, cursor: {} }
    )
    .toArray();

  const logPaths = await logCollection
    .aggregate(
      [
        {
          $match: {
            $nor: [
              { "options.type": "ERROR" },
              { "options.type": "AUTO:ERROR" },
              { "options.type": "AUTO:UNHANDLEDREJECTION" },
              { "options.type": "METRIC" },
            ],
          },
        },
        {
          $group: {
            _id: "$path",
            count: { $sum: 1 },
            actions: { $addToSet: "$options.action" },
          },
        },
        {
          $sort: { count: -1 },
        },
      ],
      { allowDiskUse: true, cursor: {} }
    )
    .toArray();

  const logsLength = await logCollection
    .aggregate(
      [
        action == "all"
          ? { $match: {} }
          : { $match: { "options.action": action } },
        {
          $match: {
            $nor: [
              { "options.type": "ERROR" },
              { "options.type": "AUTO:ERROR" },
              { "options.type": "AUTO:UNHANDLEDREJECTION" },
              { "options.type": "METRIC" },
            ],
            path: path == "all" ? { $exists: true } : path,
          },
        },
        {
          $count: "count",
        },
      ],
      { allowDiskUse: true, cursor: {} }
    )
    .toArray();

  const logs = await logCollection
    .aggregate(
      [
        action == "all"
          ? { $match: {} }
          : { $match: { "options.action": action } },
        {
          $match: {
            $nor: [
              { "options.type": "ERROR" },
              { "options.type": "AUTO:ERROR" },
              { "options.type": "AUTO:UNHANDLEDREJECTION" },
              { "options.type": "METRIC" },
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
          $sort: { ts: asc ? 1 : -1 },
        },
        {
          $skip: Math.floor(page ? page * 10 : 0),
        },
        {
          $limit: 10,
        },
      ],
      { allowDiskUse: true, cursor: {} }
    )
    .toArray();

  return accept({
    res,
    data: { logs, logsLength: logsLength[0]?.count || 0, logActions, logPaths },
  });
}
