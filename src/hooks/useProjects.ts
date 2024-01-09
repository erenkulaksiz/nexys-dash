import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Cookies from "js-cookie";

import hookRequest from "@/utils/api/hookRequest";
import { Log, server } from "@/utils";
import { nexys } from "@/utils/nexys";
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
    return hookRequest({
      url: "/v1/dash/projects",
      data: { uid: user?.uid || uid },
      token,
    });
  });

  useEffect(() => {
    if (projects?.data?.error == "auth/id-token-expired") {
      Log.error("Loading of projects failed", projects?.data?.error);
      nexys.error({ message: `useProjects - ${projects?.data?.error}` });
      (async () => {
        await refreshToken(true);
        router.replace(router.asPath);
        await projects.mutate();
      })();
      return;
    } else {
      setLoading(false);
    }
  }, [projects]);

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
