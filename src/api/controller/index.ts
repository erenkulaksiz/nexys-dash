import { NextApiRequest, NextApiResponse } from "next";

import { accept, checkUserAuth } from "@/api/utils";
import { projects } from "./projects";
import signup from "./auth/signup";
import create from "./project/create";
import data from "./project/data";
import deleteproject from "./project/delete";
import setting from "./project/setting";
import logs from "./project/logs";
import batch from "./project/batch";

type APIReturnType = (req: NextApiRequest, res: NextApiResponse) => void;

export interface ControllerReturnType {
  ping: APIReturnType;
  projects: APIReturnType;
  auth: {
    signup: APIReturnType;
  };
  project: {
    create: APIReturnType;
    data: APIReturnType;
    delete: APIReturnType;
    setting: APIReturnType;
    logs: APIReturnType;
    batch: APIReturnType;
  };
}

export function Controller(): ControllerReturnType {
  return {
    ping: (req: NextApiRequest, res: NextApiResponse) => {
      return accept({ res, data: { pong: true } });
    },
    projects: (req: NextApiRequest, res: NextApiResponse) =>
      checkUserAuth({ req, res, func: projects }),
    auth: {
      signup,
    },
    project: {
      create: (req: NextApiRequest, res: NextApiResponse) =>
        checkUserAuth({ req, res, func: create }),
      data: (req: NextApiRequest, res: NextApiResponse) =>
        checkUserAuth({ req, res, func: data }),
      delete: (req: NextApiRequest, res: NextApiResponse) =>
        checkUserAuth({ req, res, func: deleteproject }),
      setting: (req: NextApiRequest, res: NextApiResponse) =>
        checkUserAuth({ req, res, func: setting }),
      logs: (req: NextApiRequest, res: NextApiResponse) =>
        checkUserAuth({ req, res, func: logs }),
      batch: (req: NextApiRequest, res: NextApiResponse) =>
        checkUserAuth({ req, res, func: batch }),
    },
  };
}
