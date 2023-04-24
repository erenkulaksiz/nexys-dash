import { connectToDatabase } from "@/mongodb";
import { accept, reject } from "@/api/utils";
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

  const project = await projectsCollection.findOne({
    publicKey: API_KEY,
    _deleted: { $in: [null, false] },
  });

  if (!project) return reject({ res, reason: "api-key" });

  const logsCollection = await db.collection("logs");
  await logsCollection.insertOne({
    data,
    API_KEY,
    APP_NAME,
    project: project._id,
    ts: new Date().getTime(),
  });

  console.log("slug", API_KEY, APP_NAME);
  console.log("body", req.body);

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
    },
  });
}
