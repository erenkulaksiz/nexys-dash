import { connectToDatabase } from "@/mongodb";
import { ObjectId } from "mongodb";

export async function getMetric(
  project: ObjectId,
  metric: "FCP" | "LCP" | "CLS" | "FID" | "TTFB" | "CORE:INIT",
  limit: number = 99999999
) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  const Metric = await logCollection
    .aggregate([
      {
        $match: {
          $and: [
            { "options.type": "METRIC" },
            { "data.name": metric },
            { "data.value": { $gt: 0 } },
          ],
        },
      },
      { $limit: limit },
      {
        $group: {
          _id: null,
          value: { $avg: "$data.value" },
        },
      },
    ])
    .toArray();

  const Last100Metric = await logCollection
    .aggregate([
      {
        $match: {
          $and: [
            { "options.type": "METRIC" },
            { "data.name": metric },
            { "data.value": { $gt: 0 } },
          ],
        },
      },
      { $limit: 100 },
      {
        $group: {
          _id: null,
          value: { $avg: "$data.value" },
        },
      },
    ])
    .toArray();

  return [Metric[0], Last100Metric[0]];
}
