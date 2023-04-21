import { NextApiRequest, NextApiResponse } from "next";

import { accept, checkUserAuth } from "@/api/utils";
import { projects } from "./projects";
import { signup } from "./auth/signup";
import { create } from "./project/create";

type APIReturnType = (req: NextApiRequest, res: NextApiResponse) => void;

export interface ControllerReturnType {
  ping: APIReturnType;
  projects: APIReturnType;
  auth: {
    signup: APIReturnType;
  },
  project: {
    create: APIReturnType;
  }
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
    }
  }
}
