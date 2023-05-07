import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { connectToDatabase } from "@/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ValidateUserReturnType } from "@/utils/api/validateUser";
import type { ProjectTypes } from "@/types";

export default async function logs(
  req: NextApiRequest,
  res: NextApiResponse,
  validateUser: ValidateUserReturnType
) {
  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const body = req.body as { id: string; type: string; page?: number };
  if (!body || !body.id || !body.type) return reject({ res });
  const { id, type, page } = body;

  if (!ObjectId.isValid(id)) return reject({ res, reason: "invalid-id" });

  const _project = (await projectsCollection.findOne({
    _id: new ObjectId(id),
    _deleted: { $in: [null, false] },
  })) as ProjectTypes | null;

  if (!_project) return reject({ res, reason: "not-found" });

  const isOwner = _project.owner === validateUser.decodedToken.user_id;

  if (!isOwner) return reject({ res, reason: "not-owner" });

  // we validated, now load last 10 logs

  const batchCollection = await db.collection(`batches-${_project._id}`);
  const logCollection = await db.collection(`logs-${_project._id}`);

  if (type === "logs") {
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
  } else if (type === "batches") {
    const batchesLength = await batchCollection.countDocuments({});

    const batches = await batchCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip(Math.floor(page ? page * 10 : 0))
      .limit(10)
      .toArray();

    return accept({ res, data: { batches, batchesLength } });
  } else if (type === "exceptions") {
    const exceptionsLength = await logCollection.countDocuments({
      $or: [
        { "options.type": "ERROR" },
        { "options.type": "AUTO:ERROR" },
        { "options.type": "AUTO:UNHANDLEDREJECTION" },
      ],
    });

    const exceptions = await logCollection
      .find({
        $or: [
          { "options.type": "ERROR" },
          { "options.type": "AUTO:ERROR" },
          { "options.type": "AUTO:UNHANDLEDREJECTION" },
        ],
      })
      .sort({ ts: -1 })
      .skip(Math.floor(page ? page * 10 : 0))
      .limit(10)
      .toArray();

    return accept({ res, data: { exceptions, exceptionsLength } });
  } else if (type == "batches") {
    const batchesLength = await batchCollection.countDocuments({});

    const batches = await batchCollection
      .find({})
      .sort({ ts: -1 })
      .limit(10)
      .toArray();

    return accept({ res, data: { batches, batchesLength } });
  } else if (type == "all") {
    const allLength = await logCollection.countDocuments({});

    const logs = await logCollection
      .find({})
      .sort({ ts: -1 })
      .limit(10)
      .toArray();

    return accept({ res, data: { logs, allLength } });
  }

  return reject({ res, reason: "invalid-type" });
}
