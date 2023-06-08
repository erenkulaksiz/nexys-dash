import { connectToDatabase } from "@/mongodb";
import { ObjectId } from "mongodb";

export async function getExceptionRate(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  // get log rate of all days mongodb
  const exceptionRate = await logCollection
    .aggregate([
      {
        $match: {
          $or: [
            { "options.type": "ERROR" },
            { "options.type": "AUTO:ERROR" },
            { "options.type": "AUTO:UNHANDLEDREJECTION" },
          ],
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $toDate: "$ts",
              },
            },
          },
          count: {
            $sum: 1,
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

  return exceptionRate;
}

export async function getLogRate(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  const logRate = await logCollection
    .aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $toDate: "$ts",
              },
            },
          },
          count: {
            $sum: 1,
          },
          // get each type of log
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
          _id: 1,
        },
      },
    ])
    .toArray();

  return logRate;
}

export async function getLastWeekLogRate(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  const lastWeekLogs = await logCollection
    .aggregate([
      {
        $match: {
          ts: {
            $gte: Date.now() - 604800000,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $toDate: "$ts",
              },
            },
          },
          count: {
            $sum: 1,
          },
          // get each type of log
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
          _id: 1,
        },
      },
    ])
    .toArray();

  return lastWeekLogs;
}

export async function getErrorTypes(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  const errorTypes = await logCollection
    .aggregate([
      {
        $match: {
          $or: [
            { "options.type": "ERROR" },
            { "options.type": "AUTO:ERROR" },
            { "options.type": "AUTO:UNHANDLEDREJECTION" },
          ],
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

  return errorTypes;
}

export async function getLogPaths(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  const logPaths = await logCollection
    .aggregate([
      {
        $group: {
          _id: "$path",
          count: {
            $sum: 1,
          },
          // get each type of log
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
      { $sort: { count: -1 } },
    ])
    .toArray();

  return logPaths;
}

export async function getUserCountBasedLogs(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  const userCount = await logCollection
    .aggregate([
      {
        $group: {
          _id: "$user",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: 1,
          },
        },
      },
    ])
    .toArray();

  return userCount;
}

export async function getCoreData(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  const CORE_INIT = await logCollection
    .aggregate([
      {
        $match: {
          $and: [
            { "options.type": "METRIC" },
            { "data.type": "CORE:INIT" },
            { "data.diff": { $gt: 0 } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          value: { $avg: "$data.diff" },
        },
      },
    ])
    .toArray();

  const CORE_INIT_LAST_100 = await logCollection
    .aggregate([
      {
        $match: {
          $and: [
            { "options.type": "METRIC" },
            { "data.type": "CORE:INIT" },
            { "data.diff": { $gt: 0 } },
          ],
        },
      },
      {
        $limit: 100,
      },
      {
        $group: {
          _id: null,
          value: { $avg: "$data.diff" },
        },
      },
    ])
    .toArray();

  return [CORE_INIT, CORE_INIT_LAST_100];
}
