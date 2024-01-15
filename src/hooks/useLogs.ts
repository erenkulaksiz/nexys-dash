import useSWR from "swr";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import hookRequest from "@/utils/api/hookRequest";
import { useAuthStore, refreshToken } from "@/stores/authStore";
import {
  setBatches,
  setBatchesLoading,
  setExceptions,
  setExceptionsLoading,
  setLogs,
  setLogsLoading,
  useProjectStore,
} from "@/stores/projectStore";
import { Log } from "@/utils";
import { nexys } from "@/utils/nexys";
import type { LogFilterTypes } from "@/types";

interface useLogsParams {
  type: "all" | "logs" | "batches" | "exceptions";
  page?: number;
  filters?: LogFilterTypes;
}

export default function useLogs({
  type = "logs",
  page = 0,
  filters,
}: useLogsParams) {
  const user = useAuthStore((state) => state.user);
  const project = useProjectStore((state) => state.currentProject);
  const router = useRouter();

  useEffect(() => {
    if (logs.data?.data) {
      logs.mutate();
    }
  }, [page, filters?.asc, filters?.path, filters?.configUser, filters?.action]);

  const logs = useSWR(
    [
      `api/dash/project/${type}/${project?._id}/${page}/${filters?.asc}/${filters?.search}`,
    ],
    async () => {
      const token = Cookies.get("auth");
      return hookRequest({
        url: `/v1/dash/project/${project?.name}/logs`,
        data: {
          uid: user?.uid,
          id: project?._id,
          type,
          page,
          filters: {
            asc: filters?.asc ?? false,
            types: filters?.types ?? [],
            search: filters?.search ?? "",
            path: filters?.path ?? "all",
            batchVersion: filters?.batchVersion ?? "all",
            configUser: filters?.configUser ?? "all",
            action: filters?.action ?? "all",
          },
        },
        token,
      });
    },
    { revalidateIfStale: false }
  );

  useEffect(() => {
    console.log("uselogs isloading", logs.isLoading, logs.isValidating);
  }, [logs.isLoading, logs.isValidating]);

  useEffect(() => {
    if (
      logs?.data?.error == "auth/id-token-expired" ||
      logs?.data?.error == "auth/no-token" ||
      logs?.data?.error == "auth/invalid-id-token" ||
      logs?.data?.error == "auth/no-auth"
    ) {
      Log.error("Loading of logs failed", logs?.data?.error);
      nexys.error({ message: `useLogs - ${logs?.data?.error}` });
      (async () => {
        await refreshToken(true);
        setTimeout(async () => {
          router.replace(router.asPath);
          await logs.mutate();
        }, 500);
      })();
      setLoading(false);
      return;
    } else if (logs?.data?.success == false) {
      Log.error("Loading of logs failed", logs?.data?.error);
      nexys.error({ message: `useLogs - ${logs?.data?.error}` });
      setLoading(true);
      return;
    }
    if (typeof logs?.data == "object") {
      if (logs?.data != null && typeof logs?.data?.data != null) {
        if (type == "logs") {
          setLogs({
            logs: logs?.data?.data?.logs,
            logsLength: logs?.data?.data?.logsLength,
          });
        } else if (type == "batches") {
          setBatches({
            batches: logs?.data?.data?.batches,
            batchesLength: logs?.data?.data?.batchesLength,
          });
        } else if (type == "exceptions") {
          setExceptions({
            exceptions: logs?.data?.data?.exceptions,
            exceptionsLength: logs?.data?.data?.exceptionsLength,
          });
        } else if (type == "all") {
          setLogs({
            logs: logs?.data?.data?.logs,
            allLength: logs?.data?.data?.logsLength,
          });
        }
      }
      setLoading(false);
    }
  }, [logs.data]);

  useEffect(() => {
    if (logs.isLoading) {
      setLoading(true);
    } else {
      if (logs?.data?.success == false) return;
      setLoading(false);
    }
  }, [logs.isLoading]);

  function setLoading(loading: boolean) {
    if (type == "logs") setLogsLoading(loading);
    else if (type == "batches") setBatchesLoading(loading);
    else if (type == "exceptions") setExceptionsLoading(loading);
    else {
      setLogsLoading(loading);
      setBatchesLoading(loading);
      setExceptionsLoading(loading);
    }
  }

  return logs;
}
