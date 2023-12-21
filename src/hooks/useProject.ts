import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import hookRequest from "@/utils/api/hookRequest";
import { Log, server } from "@/utils";
import {
  setCurrentProject,
  setNotFound,
  setProjectLoading,
} from "@/stores/projectStore";
import { refreshToken, useAuthStore } from "@/stores/authStore";
import { nexys } from "@/utils/nexys";

interface useProjectParams {
  uid?: string;
}

export default function useProject({ uid }: useProjectParams) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const query = router.query.id?.toString() || "";

  const project = useSWR(
    [`api/dash/project/data/${query}`],
    async () => {
      const token = Cookies.get("auth");
      return hookRequest({
        url: `/v1/dash/project/${query}`,
        data: {
          uid: uid || user?.uid,
          id: query,
        },
        token,
      });
    },
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (project?.data?.error == "project/not-found") {
      Log.error("Loading of project failed", project?.data?.error);
      nexys.error({ message: project?.data?.error });

      setNotFound(true);
      setProjectLoading(false);
      return;
    }
    if (project?.data?.error) {
      Log.error("Loading of project failed", project?.data?.error);
      nexys.error({ message: project?.data?.error });
      (async () => {
        await refreshToken(true);
        await project.mutate();
        router.replace(router.asPath);
      })();
      setProjectLoading(false);
      setNotFound(true);
      return;
    }
    setCurrentProject(project?.data?.data);
    setProjectLoading(false);
    setNotFound(false);
    Log.debug("project", project.data);
  }, [project.data]);

  useEffect(() => {
    if (project.isLoading) {
      setProjectLoading(true);
    } else {
      if (project?.data?.success == false) return;
      setProjectLoading(false);
    }
  }, [project.isLoading]);

  return project;
}
