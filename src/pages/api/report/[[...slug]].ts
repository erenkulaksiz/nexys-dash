import { ObjectId } from "mongodb";

import { connectToDatabase } from "@/mongodb";
import { accept, reject } from "@/api/utils";
import { Log } from "@/utils";
import { ProjectTypes } from "@/types";
import { LIMITS } from "@/constants";
import { createSearchIndex } from "@/api/utils";
import { SendTelegramMessage } from "@/utils/telegram";
import type { NextApiRequest, NextApiResponse } from "next";

type NextApiRequestWithQuery = NextApiRequest & {
  req: {
    query: string | string[];
  };
};

export default async function handler(
  req: NextApiRequestWithQuery,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Allow content-type header in access control
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  const ip = req.headers["x-forwarded-for"] || req?.socket?.remoteAddress;

  if (req.method === "OPTIONS") return accept({ res });
  if (req.method !== "POST") return reject({ res });
  const { slug } = req.query;

  if (!slug || slug.length == 0) return reject({ res, reason: "no-slug" });
  if (!Array.isArray(slug)) return reject({ res, reason: "non-slug-array" });
  if (slug.length != 2) return reject({ res, reason: "wrong-slug-array" });

  const API_KEY = slug[0];
  const APP_NAME = slug[1];

  const { db } = await connectToDatabase();
  const projectsCollection = await db.collection("projects");

  const data = req.body;

  if (!data) return reject({ res, reason: "no-data" });
  // TODO: validate data like user agent and other data

  const project = (await projectsCollection.findOne({
    publicKey: API_KEY,
    _deleted: { $in: [null, false] },
  })) as ProjectTypes;

  if (!project) return reject({ res, reason: "api-key" });

  if (project.name !== APP_NAME) return reject({ res, reason: "app-name" });
  //if (project.verified !== true) return reject({ res, reason: "not-verified" });

  let isDomainHostSame = project.domain === req.headers?.host;
  if (!isDomainHostSame) {
    const host = req.headers?.host?.split(".");
    host?.shift();
    isDomainHostSame = project.domain === host?.join(".");
  }

  Log.debug(
    "isDomainHostSame",
    isDomainHostSame,
    " project?.localhostAccess",
    project?.localhostAccess,
    " project?.domain",
    project?.domain,
    " req.headers.host",
    req.headers.host
  );

  if (project?.localhostAccess !== true && !isDomainHostSame)
    return reject({ res, reason: "domain" });

  const logUsage = project.logUsage || 0;
  const logUsageLimit = project.logUsageLimit || LIMITS.MAX.LOG_USAGE_LIMIT;
  const logUsageLimitReached = logUsage >= logUsageLimit;

  if (logUsageLimitReached) {
    return reject({
      res,
      reason: `log-usage-limit-${logUsage}-${logUsageLimit}`,
    });
  }

  const { logs, requests, ...rest } = data;

  const logsCollection = await db.collection(`logs-${project._id}`);
  const batchesCollection = await db.collection(`batches-${project._id}`);

  let logTypes = {};
  // increase log type count
  logs.forEach((log: any) => {
    const type = log?.options?.type;
    // @ts-ignore
    if (logTypes[type]) {
      // @ts-ignore
      logTypes[type] = logTypes[type] + 1;
    } else {
      // @ts-ignore
      logTypes[type] = 1;
    }
  });

  const batchInsert = await batchesCollection.insertOne({
    ...rest,
    createdAt: Date.now(),
    logTypes,
    ip,
  });

  const logInsert = await logsCollection.insertMany(
    logs.map((log: any) => ({
      ...log,
      batchId: batchInsert?.insertedId,
    }))
  );

  await batchesCollection.updateOne(
    { _id: new ObjectId(batchInsert?.insertedId) },
    {
      $set: {
        logIds: logInsert.insertedIds,
      },
    }
  );

  await projectsCollection.updateOne(
    { _id: new ObjectId(project._id) },
    {
      $set: {
        updatedAt: Date.now(),
        verified: isDomainHostSame ? true : false,
        verifiedAt: isDomainHostSame ? Date.now() : 0,
      },
      $inc: {
        logUsage: logs.length,
      },
    }
  );

  await createSearchIndex(new ObjectId(project._id));

  await SendTelegramMessage({
    message: `
RECIEVED REPORT

📈 ${project.name} (${project.domain})

📊 ${logs.length} logs

📅 ${new Date().toLocaleString()}

Limit: ${logUsage + 1}/${logUsageLimit}`,
  });

  return accept({
    res,
    data: {
      client: {
        latestVersion: "1.0.3",
        softVersion: "1.0.0",
        hardVersion: "1.0.0",
      },
      server: {
        version: "1.0.0",
        dashboard: "1.0.0",
      },
      logUsage: logUsage + 1,
      logUsageLimit,
    },
  });
}
