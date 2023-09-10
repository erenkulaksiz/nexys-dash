import { ObjectId } from "mongodb";

import { accept, reject } from "@/api/utils";
import { Log } from "@/utils";
import { connectToDatabase } from "@/mongodb";
import { LIMITS } from "@/constants";

export default async function filteredExceptions({
  body,
  project,
  res,
}: {
  body: any;
  project?: ObjectId;
  res: any;
}) {
  const {
    page,
    filters: { asc, types, search, path, batchVersion, configUser },
  } = body;
  const { db } = await connectToDatabase();
  const logCollection = await db.collection(`logs-${project}`);

  if (search?.length > LIMITS.MAX.PROJECT_LOG_SEARCH_TEXT_LENGTH) {
    return reject({ res, reason: "search-maxlength" });
  }

  const selectTypes = types?.length
    ? types?.map((type: any) => ({ "options.type": type }))
    : [
        { "options.type": "ERROR" },
        { "options.type": "AUTO:ERROR" },
        { "options.type": "AUTO:UNHANDLEDREJECTION" },
      ];

  const exceptionUserMatch = {
    "batchConfig.user": configUser,
  };

  const exceptionVersionMatch = {
    "batchConfig.appVersion": batchVersion,
  };

  let exceptionMatch = {};

  if (configUser != "all" || batchVersion != "all") {
    if (configUser != "all" && batchVersion != "all") {
      exceptionMatch = {
        $and: [exceptionUserMatch, exceptionVersionMatch],
      };
    } else if (configUser != "all") {
      exceptionMatch = exceptionUserMatch;
    } else if (batchVersion != "all") {
      exceptionMatch = exceptionVersionMatch;
    }
  }

  const exceptions = await logCollection
    .aggregate(
      [
        !search || search?.length == 0
          ? {
              $match: {},
            }
          : {
              $match: {
                $text: {
                  $search: search,
                },
              },
            },
        {
          $facet: {
            paginatedResults: [
              {
                $match: {
                  $or: selectTypes,
                  path: path == "all" ? { $exists: true } : path,
                },
              },
              {
                $match: exceptionMatch,
              },
              { $sort: { ts: asc ? 1 : -1 } },
              { $skip: Math.floor(page ? page * 10 : 0) },
              { $limit: 10 },
            ],
            totalCount: [
              { $match: { $or: selectTypes } },
              {
                $match: exceptionMatch,
              },
              {
                $count: "count",
              },
            ],
            paths: [
              {
                $group: {
                  _id: "$path",
                  count: {
                    $sum: {
                      $cond: [
                        {
                          $or: [
                            { $eq: ["$options.type", "ERROR"] },
                            { $eq: ["$options.type", "AUTO:ERROR"] },
                            {
                              $eq: ["$options.type", "AUTO:UNHANDLEDREJECTION"],
                            },
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },
              {
                $sort: {
                  count: -1,
                },
              },
            ],
            batchConfigUsers: [
              {
                $match: {
                  "batchConfig.user": { $exists: true, $ne: null },
                  $or: selectTypes,
                },
              },
              {
                $group: {
                  _id: "$batchConfig.user",
                  count: { $sum: 1 },
                },
              },
              {
                $sort: {
                  count: -1,
                },
              },
            ],
            batchVersions: [
              {
                $match: {
                  "batchConfig.appVersion": { $exists: true, $ne: null },
                  $or: selectTypes,
                },
              },
              {
                $group: {
                  _id: "$batchConfig.appVersion",
                  count: { $sum: 1 },
                },
              },
              {
                $sort: {
                  count: -1,
                },
              },
            ],
            exceptionTypes: [
              {
                $match: {
                  $or: [
                    { "options.type": "ERROR" },
                    { "options.type": "AUTO:ERROR" },
                    { "options.type": "AUTO:UNHANDLEDREJECTION" },
                  ],
                  path: path == "all" ? { $exists: true } : path,
                },
              },
              {
                $match: exceptionMatch,
              },
              {
                $group: {
                  _id: "$options.type",
                  count: { $sum: 1 },
                },
              },
              {
                $sort: {
                  count: -1,
                },
              },
            ],
          },
        },
      ],
      { allowDiskUse: true, cursor: {} }
    )
    .toArray();

  return accept({
    res,
    data: {
      exceptions: exceptions[0]?.paginatedResults || [],
      exceptionsLength: exceptions[0]?.totalCount[0]?.count || 0,
      exceptionTypes: exceptions[0]?.exceptionTypes || [],
      exceptionPaths: exceptions[0]?.paths || [],
      batchConfigUsers: exceptions[0]?.batchConfigUsers || [],
      batchVersions: exceptions[0]?.batchVersions || [],
    },
  });
}
