import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";

export default async function filteredLogs({
  project,
  res,
  page,
}: {
  project?: ObjectId;
  res: any;
  page?: number;
}) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  const logsLength = await logCollection.countDocuments({
    $nor: [
      { "options.type": "ERROR" },
      { "options.type": "AUTO:ERROR" },
      { "options.type": "AUTO:UNHANDLEDREJECTION" },
      { "options.type": "METRIC" },
    ],
  });

  const logs = await logCollection
    .find({
      $nor: [
        { "options.type": "ERROR" },
        { "options.type": "AUTO:ERROR" },
        { "options.type": "AUTO:UNHANDLEDREJECTION" },
        { "options.type": "METRIC" },
      ],
    })
    .sort({ ts: -1 })
    .skip(Math.floor(page ? page * 10 : 0))
    .limit(10)
    .toArray();

  return accept({ res, data: { logs, logsLength } });
}
