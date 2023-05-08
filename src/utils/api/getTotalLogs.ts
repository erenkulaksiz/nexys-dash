import { connectToDatabase } from "@/mongodb";

import { Log } from "../logger";

export default async function getTotalLogs() {
  const { db } = await connectToDatabase();

  const logCollections = await db
    .listCollections()
    .map((collection) => collection.name.startsWith("logs-") && collection.name)
    .toArray();

  logCollections.filter((collection) => collection !== false);

  const totalLogs = await Promise.all(
    logCollections.map(async (collection) => {
      const totalLogs = await db
        .collection(collection.toString())
        .countDocuments({
          $nor: [
            { "options.type": "ERROR" },
            { "options.type": "AUTO:ERROR" },
            { "options.type": "AUTO:UNHANDLEDREJECTION" },
          ],
        });

      return totalLogs;
    })
  );
  const totalLogCount = totalLogs.reduce((a, b) => a + b, 0);
  const ceil = Math.ceil(totalLogCount / 1000) * 1000;

  return ceil;
}
