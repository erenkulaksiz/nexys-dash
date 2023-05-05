import { ObjectId } from "mongodb";

import { connectToDatabase } from "@/mongodb";
import { accept, reject } from "@/api/utils";
import { Log } from "@/utils";
import { ProjectTypes } from "@/types";
import { LIMITS } from "@/constants";
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

  function getDomainWithoutSubdomain(url: string) {
    const urlParts = new URL(url).hostname.split(".");

    return urlParts
      .slice(0)
      .slice(-(urlParts.length === 4 ? 3 : 2))
      .join(".");
  }

  const isDomainHostSame =
    project.domain ===
    getDomainWithoutSubdomain(req.headers?.host ?? req.headers?.origin ?? "");

  Log.debug(
    "isDomainHostSame",
    isDomainHostSame,
    " project?.localhostAccess",
    project?.localhostAccess,
    " project?.domain",
    project?.domain,
    " req.headers.host",
    req.headers.host,
    " req.headers.origin",
    req.headers.origin,
    "getDomainWithoutSubdomain",
    getDomainWithoutSubdomain(req.headers?.host ?? req.headers?.origin ?? "")
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

  await projectsCollection.updateOne(
    { _id: new ObjectId(project._id) },
    {
      $set: {
        updatedAt: Date.now(),
        verified: isDomainHostSame ? true : false,
        verifiedAt: isDomainHostSame ? Date.now() : 0,
      },
      $inc: {
        logUsage: 1,
      },
    }
  );

  const logsCollection = await db.collection("logs");
  await logsCollection.insertOne({
    data,
    API_KEY,
    APP_NAME,
    project: project._id,
    createdAt: Date.now(),
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
