import { useRouter } from "next/router";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useEffect } from "react";

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
import { Log, server } from "@/utils";

interface useLogsParams {
  type: "all" | "logs" | "batches" | "exceptions";
  page?: number;
  asc?: boolean;
  types?: string[];
}

export default function useLogs({
  type = "logs",
  page = 0,
  asc = false,
  types = [],
}: useLogsParams) {
  const user = useAuthStore((state) => state.user);
  const project = useProjectStore((state) => state.currentProject);
  const router = useRouter();

  useEffect(() => {
    if (logs.data?.data) {
      logs.mutate();
    }
  }, [page, asc]);

  const logs = useSWR(
    [`api/dash/project/${type}/${project?._id}/${page}/${asc}`],
    async () => {
      const token = Cookies.get("auth");
      return fetch(`${server}/api/dash/project/logs`, {
        headers: new Headers({
          "content-type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        }),
        method: "POST",
        body: JSON.stringify({
          uid: user?.uid,
          id: project?._id,
          type,
          page,
          asc,
          types,
        }),
      })
        .then(async (res) => {
          let json = null;
          try {
            json = await res.json();
          } catch (error) {
            Log.error("useLogs error json", error);
          }
          if (res.ok) {
            return { success: true, data: json.data };
          }
          return { success: false, error: json.error, data: null };
        })
        .catch((error) => {
          return { success: false, error: error.message, data: null };
        });
    }
  );

  useEffect(() => {
    setLoading(true);
    if (logs?.data?.error) {
      Log.error("Loading of logs failed", logs?.data?.error);
      if (
        logs?.data?.error == "auth/id-token-expired" ||
        logs?.data?.error == "auth-uid-error"
      ) {
        (async () => {
          await refreshToken(true);
          await logs.mutate();
          //router.reload();
        })();
        return;
      }
      setLoading(false);
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
    if (logs.isValidating) {
      setLoading(true);
    } else {
      if (logs?.data?.success == false) return;
      setLoading(false);
    }
  }, [logs.isValidating]);

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

  function setData(data: any) {
    if (type == "logs") setLogs(data);
    else if (type == "batches") setBatches(data);
    else if (type == "exceptions") setExceptions(data);
    else {
      setLogs(data);
    }
  }

  return logs;
}
