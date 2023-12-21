import { useState, useEffect } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";

import { Log, server } from "@/utils";
import { useAuthStore } from "@/stores/authStore";
import { useProjectStore } from "@/stores/projectStore";
import { nexys } from "@/utils/nexys";
import { refreshToken } from "@/stores/authStore";

interface usePathDetailsParams {
  path: string;
}

export default function usePathDetails({ path }: usePathDetailsParams) {
  const [pathDetailsLoading, setPathDetailsLoading] = useState<boolean>(false);
  const user = useAuthStore((state) => state.user);
  const project = useProjectStore((state) => state.currentProject);

  const pathDetails = useSWR(
    [`api/dash/project/path/details/${path}`],
    async () => {
      const token = Cookies.get("auth");
      return fetch(`${server}/dash/project/path/details`, {
        headers: new Headers({
          "content-type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        }),
        method: "POST",
        body: JSON.stringify({
          path,
          uid: user?.uid,
          id: project?._id,
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
    }
  );

  useEffect(() => {
    setPathDetailsLoading(true);
    if (pathDetails?.data?.error) {
      Log.error("Loading of paths failed", pathDetails?.data?.error);
      nexys.error({ message: pathDetails?.data?.error });
      if (
        pathDetails?.data?.error == "auth/id-token-expired" ||
        pathDetails?.data?.error == "auth-uid-error"
      ) {
        (async () => {
          await refreshToken(true);
          await pathDetails.mutate();
          //router.reload();
        })();
        return;
      }
      setPathDetailsLoading(false);
      return;
    }
    if (typeof pathDetails?.data == "object") {
      setPathDetailsLoading(false);
    }
  }, [pathDetails.data]);

  return { pathDetails, pathDetailsLoading };
}
