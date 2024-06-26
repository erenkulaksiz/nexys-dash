import type { PropsWithChildren } from "react";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";

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

export interface ReportType {
  count: number;
  dailyCount: Array<{
    date: string;
    count: number;
  }>;
  firstOccurrence: string;
  lastOccurrence: string;
  logIds: {
    $oid: string;
  }[];
  batchIds: {
    $oid: string;
  }[];
  platformCount: {
    platform: string[];
    count: number;
  }[];
  versionCount: {
    version: string;
    count: number;
  }[];
  affectedUsers: {
    user: string[];
    count: number;
  }[];
  _id: string;
}

export interface ProjectTypes {
  _id?: string;
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
    FCP?: number;
    LCP?: number;
    CLS?: number;
    FID?: number;
    TTFB?: number;
    CORE_INIT?: number;
    LOGPOOL_SENDALL?: number;
    totalMetricLogs?: number;
    last100: {
      FCP?: number;
      LCP?: number;
      CLS?: number;
      FID?: number;
      TTFB?: number;
      CORE_INIT?: number;
      LOGPOOL_SENDALL?: number;
    };
  };
  plan?: "free" | "pro" | "enterprise";
  planExpireAt?: number;
  telegram?: {
    botId: string;
    targetId: string;
  };
  report?: ReportType[];
}

export interface NexysComponentProps extends PropsWithChildren {
  validate?: ValidateTokenReturnType;
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
  _id?: {
    $oid: string;
  };
  isAdmin?: boolean;
  subscription?: {
    type: "free" | "basic" | "pro" | "enterprise";
    expiresAt: number | null;
    boughtAt: number | null;
    boughtIP: string | null;
  };
}

export interface LogFilterTypes {
  asc?: boolean;
  types?: string[];
  path?: string;
  batchVersion?: string;
  configUser?: string;
  search?: string;
  action?: string;
}
