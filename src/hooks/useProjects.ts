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
    if (
      projects?.data?.error == "auth/id-token-expired" ||
      projects?.data?.error == "auth/no-token" ||
      projects?.data?.error == "auth/invalid-id-token" ||
      projects?.data?.error == "auth/no-auth"
    ) {
      Log.error("Loading of projects failed", projects?.data?.error);
      nexys.error({ message: `useProjects - ${projects?.data?.error}` });
      setLoading(true);
      (async () => {
        await refreshToken(true);
        setTimeout(async () => {
          router.replace(router.asPath);
          await projects.mutate();
        }, 500);
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
