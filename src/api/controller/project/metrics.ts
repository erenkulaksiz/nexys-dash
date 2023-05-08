import { connectToDatabase } from "@/mongodb";
import { ObjectId } from "mongodb";

export async function getFCPMetric(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);
  const FCPMetric = await logCollection
    .aggregate([
      {
        $match: {
          $and: [
            { "options.type": "METRIC" },
            { "data.name": "FCP" },
            { "data.value": { $gt: 0 } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          FCP: { $avg: "$data.value" },
        },
      },
    ])
    .toArray();

  return FCPMetric;
}

export async function getLCPMetric(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);
  const LCPMetric = await logCollection
    .aggregate([
      {
        $match: {
          $and: [
            { "options.type": "METRIC" },
            { "data.name": "LCP" },
            { "data.value": { $gt: 0 } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          LCP: { $avg: "$data.value" },
        },
      },
    ])
    .toArray();

  return LCPMetric;
}

export async function getCLSMetric(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);
  const CLSMetric = await logCollection
    .aggregate([
      {
        $match: {
          $and: [
            { "options.type": "METRIC" },
            { "data.name": "CLS" },
            { "data.value": { $gt: 0 } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          CLS: { $avg: "$data.value" },
        },
      },
    ])
    .toArray();

  return CLSMetric;
}

export async function getFIDMetric(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);
  const FIDMetric = await logCollection
    .aggregate([
      {
        $match: {
          $and: [
            { "options.type": "METRIC" },
            { "data.name": "FID" },
            { "data.value": { $gt: 0 } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          FID: { $avg: "$data.value" },
        },
      },
    ])
    .toArray();

  return FIDMetric;
}

export async function getTTFBMetric(project: ObjectId | null) {
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);
  const TTFBMetric = await logCollection
    .aggregate([
      {
        $match: {
          $and: [
            { "options.type": "METRIC" },
            { "data.name": "TTFB" },
            { "data.value": { $gt: 0 } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          TTFB: { $avg: "$data.value" },
        },
      },
    ])
    .toArray();

  return TTFBMetric;
}
