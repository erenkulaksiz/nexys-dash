import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { setBatchLoading, setCurrentBatch } from "@/stores/projectStore";
import { Log, server } from "@/utils";
import { refreshToken } from "@/stores/authStore";

interface useBatchParams {
  uid: string;
}

export default function useBatch({ uid }: useBatchParams) {
  const router = useRouter();

  const { id, batchId } = router.query;

  const batch = useSWR([`api/dash/project/batch/${batchId}`], async () => {
    const token = Cookies.get("auth");
    return fetch(`${server}/api/dash/project/batch`, {
      headers: new Headers({
        "content-type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      }),
      method: "POST",
      body: JSON.stringify({
        uid,
        projectId: id,
        id: batchId,
      }),
    })
      .then(async (res) => {
        let json = null;
        try {
          json = await res.json();
        } catch (error) {
          Log.error("useBatch error json", error);
        }
        if (res.ok) {
          return { success: true, data: json.data };
        }
        return { success: false, error: json.error, data: null };
      })
      .catch((error) => {
        return { success: false, error: error.message, data: null };
      });
  });

  useEffect(() => {
    setBatchLoading(true);
    if (batch?.data?.error) {
      Log.error("Loading of project failed", batch?.data?.error);
      if (
        batch?.data?.error == "auth/id-token-expired" ||
        batch?.data?.error == "auth-uid-error"
      ) {
        (async () => {
          await refreshToken(true);
          await batch.mutate();
          //router.reload();
        })();
        return;
      }
      setBatchLoading(false);
      return;
    }
    if (typeof batch?.data == "object") {
      if (batch?.data != null && typeof batch?.data?.data != null) {
        setCurrentBatch(batch?.data?.data);
      }
      setBatchLoading(false);
    }
  }, [batch.data]);

  return batch;
}
