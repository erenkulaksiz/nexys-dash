import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";

export default async function filteredAll({
  res,
  project,
}: {
  res: any;
  project?: ObjectId;
}) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);
  const allLength = await logCollection.countDocuments({});

  const logs = await logCollection
    .find({})
    .sort({ ts: -1 })
    .limit(10)
    .toArray();

  return accept({ res, data: { logs, allLength } });
}
