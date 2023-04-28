import { useEffect, useState } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { Log, server } from "@/utils";
import { refreshToken } from "@/stores/authStore";

interface useProjectsParams {
  uid: string;
}

export default function useProjects({ uid }: useProjectsParams) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const projects = useSWR(["api/dash/projects"], async () => {
    const token = Cookies.get("auth");
    return fetch(`${server}/api/dash/projects`, {
      headers: new Headers({
        "content-type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      }),
      method: "POST",
      body: JSON.stringify({ uid }),
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
      if (
        projects?.data?.error == "auth/id-token-expired" ||
        projects?.data?.error == "auth-uid-error"
      ) {
        (async () => {
          await refreshToken(true);
          await projects.mutate();
          router.reload();
        })();
      }
      return;
    } else {
      setLoading(false);
    }
  }, [projects.data]);

  useEffect(() => {
    if (projects.isValidating) {
      setLoading(true);
    } else {
      if (projects?.data?.success == false) return;
      setLoading(false);
    }
  }, [projects.isValidating]);

  return { projects, loading };
}
