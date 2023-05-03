import { ObjectId } from "mongodb";
import type { PropsWithChildren } from "react";

export interface LogTypes {
  API_KEY: string;
  APP_NAME: string;
  project: string;
  _id: string;
  data: any;
  ts: number;
}

export interface ProjectTypes {
  _id?: ObjectId;
  publicKey?: string;
  name: string;
  domain: string;
  owner?: string;
  createdAt?: number;
  updatedAt?: number;
  logs?: LogTypes[];
  verified?: boolean;
  verifiedAt?: number;
  localhostAccess?: boolean;
  logUsage?: number;
  logUsageLimit?: number;
}

export interface NexysComponentProps extends PropsWithChildren {
  validate?: {
    success: boolean;
    data: UserTypes;
    error?: string | object;
  };
}

export interface UserTypes {
  email?: string;
  username: string;
  uid: string;
  createdAt: number;
  updatedAt: number;
  fullname?: string;
  avatar?: string;
  provider?: string;
  emailVerified?: boolean;
  _id?: ObjectId;
}
