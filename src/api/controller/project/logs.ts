import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { Log } from "@/utils";
import { connectToDatabase } from "@/mongodb";
import filteredLogs from "./filter/logs";
import filteredBatches from "./filter/batches";
import filteredAll from "./filter/all";
import filteredExceptions from "./filter/exceptions";
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

  const body = req.body as {
    id: string;
    type: string;
    page?: number;
    asc?: boolean;
    types?: string[];
    search?: string;
    path?: string;
    batchVersion?: string;
    action?: string;
    configUser?: string;
  };
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

  if (type === "logs") {
    return await filteredLogs({ body, project: _project._id, res, page });
  } else if (type === "batches") {
    return await filteredBatches({ project: _project._id, res, page });
  } else if (type === "exceptions") {
    return await filteredExceptions({ body, project: _project._id, res });
  } else if (type == "all") {
    return await filteredAll({ res });
  }

  return reject({ res, reason: "invalid-type" });
}
