import useSWR from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";

import hookRequest from "@/utils/api/hookRequest";
import { setBatchLoading, setCurrentBatch } from "@/stores/projectStore";
import { Log, server } from "@/utils";
import { refreshToken, useAuthStore } from "@/stores/authStore";

interface useBatchParams {
  page?: number;
  uid?: string;
}

export default function useBatch({ uid, page = 0 }: useBatchParams) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { id, batchId } = router.query;

  useEffect(() => {
    if (batch.data?.data) {
      batch.mutate();
    }
  }, [page]);

  const batch = useSWR(
    [`api/dash/project/batch/${batchId}`],
    async () => {
      const token = Cookies.get("auth");
      return hookRequest({
        url: `/v1/dash/project/${id}/batch/${batchId}`,
        data: {
          uid: uid || user?.uid,
          page,
          asc: false,
          type: "batch",
          filters: [],
        },
        token,
      });
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    setBatchLoading(true);
    if (
      batch?.data?.error == "batch/not-found" ||
      batch?.data?.error == "project/not-found"
    ) {
      Log.error("Loading of batch failed", batch?.data?.error);
      setBatchLoading(false);
      return;
    }
    if (
      batch?.data?.error == "auth/id-token-expired" ||
      batch?.data?.error == "auth/no-token" ||
      batch?.data?.error == "auth/invalid-id-token" ||
      batch?.data?.error == "auth/no-auth"
    ) {
      Log.error("Loading of batch failed", batch?.data?.error);
      setBatchLoading(true);
      (async () => {
        await refreshToken(true);
        setTimeout(async () => {
          router.replace(router.asPath);
          await batch.mutate();
        }, 500);
      })();
      return;
    }
    if (batch?.data?.success) {
      setCurrentBatch(batch?.data?.data);
      setBatchLoading(false);
    }
  }, [batch]);

  useEffect(() => {
    if (batch.isValidating) {
      setBatchLoading(true);
    } else {
      if (batch?.data?.success == false) return;
      setBatchLoading(false);
    }
  }, [batch.isValidating]);

  return batch;
}
