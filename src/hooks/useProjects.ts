import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Cookies from "js-cookie";

import { Log, server } from "@/utils";
import { refreshToken, useAuthStore } from "@/stores/authStore";

interface useProjectsParams {
  uid?: string;
}

export default function useProjects({ uid }: useProjectsParams) {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const projects = useSWR(["api/dash/projects"], async () => {
    const token = Cookies.get("auth");
    return fetch(`${server}/v1/dash/projects`, {
      headers: new Headers({
        "content-type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      }),
      method: "POST",
      body: JSON.stringify({ uid: user?.uid || uid }),
    })
      .then(async (res) => {
        let json = null;
        try {
          json = await res.json();
        } catch (error) {
          Log.error("LogPage error json", error);
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
    if (projects?.data?.success == false) {
      Log.error("Loading of projects failed", projects?.data?.error);
      (async () => {
        await refreshToken(true);
        await projects.mutate();
        router.replace(router.asPath);
      })();
      return;
    } else {
      setLoading(false);
    }
  }, [projects.data]);

  useEffect(() => {
    if (projects.isLoading) {
      setLoading(true);
    } else {
      if (projects?.data?.success == false) return;
      setLoading(false);
    }
  }, [projects.isLoading]);

  return { projects, loading };
}
