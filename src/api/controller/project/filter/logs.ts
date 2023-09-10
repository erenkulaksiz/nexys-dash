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

  const logs = await logCollection
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
          $facet: {
            logs: [
              action == "all"
                ? { $match: {} }
                : { $match: { "options.action": action } },
              {
                $match: {
                  path: path == "all" ? { $exists: true } : path,
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
            logsLength: [
              action == "all"
                ? { $match: {} }
                : { $match: { "options.action": action } },
              {
                $match: {
                  path: path == "all" ? { $exists: true } : path,
                },
              },
              {
                $count: "count",
              },
            ],
            logPaths: [
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
            logActions: [
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
          },
        },
      ],
      { allowDiskUse: true, cursor: {} }
    )
    .toArray();

  return accept({
    res,
    data: {
      logs: logs[0].logs,
      logsLength: logs[0].logsLength[0]?.count || 0,
      logActions: logs[0].logActions || [],
      logPaths: logs[0].logPaths || [],
    },
  });
}
