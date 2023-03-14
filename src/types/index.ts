import { ObjectId } from "mongodb";
import type { PropsWithChildren } from "react";

export interface ProjectTypes {
  _id?: ObjectId;
  publicKey?: string;
  name: string;
  domain: string;
  owner?: string;
  createdAt?: number;
  updatedAt?: number;
  logs?: any;
}

export interface NexysComponentProps extends PropsWithChildren {
  validate?: {
    success: boolean;
    data: UserTypes;
    error?: string | object;
  };
  route?:
    | string
    | {
        id: string;
        batchId: string;
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
