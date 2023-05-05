import { connectToDatabase } from "@/mongodb";

export default async function getTotalErrors() {
  const { db } = await connectToDatabase();

  const logs = await db
    .collection("logs")
    .aggregate([
      {
        $unwind: { path: "$data.logs" },
      },
      {
        $group: {
          _id: "$_id",
          logs: {
            $push: {
              // check the type of the log
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$data.logs.options.type", "ERROR"] },
                    { $eq: ["$data.logs.options.type", "AUTO:ERROR"] },
                    {
                      $eq: [
                        "$data.logs.options.type",
                        "AUTO:UNHANDLEDREJECTION",
                      ],
                    },
                  ],
                },
                then: "$data.logs",
                else: null,
              },
            },
          },
          count: {
            $sum: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$data.logs.options.type", "ERROR"] },
                    { $eq: ["$data.logs.options.type", "AUTO:ERROR"] },
                    {
                      $eq: [
                        "$data.logs.options.type",
                        "AUTO:UNHANDLEDREJECTION",
                      ],
                    },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          totalErrors: { $sum: "$count" },
        },
      },
    ])
    .toArray();

  return logs.reduce((a, b) => a + b.totalErrors, 0);
}
