import { connectToDatabase } from "@/mongodb";

export default async function getTotalErrors() {
  const { db } = await connectToDatabase();

  const logCollections = await db
    .listCollections()
    .map((collection) => collection.name.startsWith("logs-") && collection.name)
    .toArray();

  logCollections.filter((collection) => collection !== false);

  const totalErrors = await Promise.all(
    logCollections.map(async (collection) => {
      const totalErrors = await db
        .collection(collection.toString())
        .countDocuments({
          $or: [
            { "options.type": "ERROR" },
            { "options.type": "AUTO:ERROR" },
            { "options.type": "AUTO:UNHANDLEDREJECTION" },
          ],
        });

      return totalErrors;
    })
  );
  const totalErrorCount = totalErrors.reduce((a, b) => a + b, 0);
  const ceil = Math.ceil(totalErrorCount / 1000) * 1000;

  return ceil;
}
