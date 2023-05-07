import useSWR from "swr";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Log, server } from "@/utils";
import {
  setCurrentProject,
  setNotFound,
  setProjectLoading,
} from "@/stores/projectStore";
import { refreshToken, useAuthStore } from "@/stores/authStore";

interface useProjectParams {
  uid: string;
}

export default function useProject({ uid }: useProjectParams) {
  const router = useRouter();
  const query = router.query.id?.toString() || "";

  const project = useSWR([`api/dash/project/data/${query}`], async () => {
    const token = Cookies.get("auth");
    return fetch(`${server}/api/dash/project/data`, {
      headers: new Headers({
        "content-type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      }),
      method: "POST",
      body: JSON.stringify({
        uid,
        id: query,
      }),
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
    setProjectLoading(true);
    if (project?.data?.error) {
      Log.error("Loading of project failed", project?.data?.error);
      if (
        project?.data?.error == "auth/id-token-expired" ||
        project?.data?.error == "auth-uid-error"
      ) {
        (async () => {
          await refreshToken(true);
          await project.mutate();
          router.reload();
        })();
        return;
      }
      setNotFound(true);
      setProjectLoading(false);
      return;
    }
    if (typeof project?.data == "object") {
      if (project?.data != null && typeof project?.data?.data != null) {
        setCurrentProject(project?.data?.data);
        setNotFound(false);
      }
      setProjectLoading(false);
    }
  }, [project.data]);

  return project;
}
