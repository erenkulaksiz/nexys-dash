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

export interface LogMetricTypes {
  _id: string;
  count: number;
  "AUTO:ERROR": number;
  "AUTO:UNHANDLEDREJECTION": number;
  ERROR: number;
  METRIC: number;
  OTHER: number;
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
  batchCount?: number;
  logCount?: number;
  errorCount?: number;
  exceptionRate?: Array<{ _id: string; count: number }>;
  logRate?: LogMetricTypes[];
  errorTypes?: Array<{ _id: string; count: number }>;
  logPaths?: LogMetricTypes[];
  lastWeekLogRate?: LogMetricTypes[];
  metrics?: {
    FCP?: {
      value: number;
    };
    LCP?: {
      value: number;
    };
    CLS?: {
      value: number;
    };
    FID?: {
      value: number;
    };
    TTFB?: {
      value: number;
    };
    CORE_INIT?: number;
    LOGPOOL_SENDALL?: number;
    totalMetricLogs?: number;
    last100: {
      FCP?: {
        value: number;
      };
      LCP?: {
        value: number;
      };
      CLS?: {
        value: number;
      };
      FID?: {
        value: number;
      };
      TTFB?: {
        value: number;
      };
      CORE_INIT?: number;
      LOGPOOL_SENDALL?: number;
    };
  };
  plan?: "free" | "pro" | "enterprise";
}

export interface NexysComponentProps extends PropsWithChildren {
  validate?: {
    success: boolean;
    data: UserTypes;
    error?: string | object;
  };
  query?: {
    page: string;
  };
  totalErrors?: number;
  totalLogs?: number;
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
