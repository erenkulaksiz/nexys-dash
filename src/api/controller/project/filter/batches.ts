import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";

export default async function filteredBatches({
  project,
  res,
  page,
}: {
  project?: ObjectId;
  res: any;
  page?: number;
}) {
  const { db } = await connectToDatabase();
  const batchCollection = await db.collection(`batches-${project}`);
  const batchesLength = await batchCollection.countDocuments({});

  const batches = await batchCollection
    .find({})
    .sort({ createdAt: -1 })
    .skip(Math.floor(page ? page * 10 : 0))
    .limit(10)
    .toArray();

  return accept({ res, data: { batches, batchesLength } });
}
