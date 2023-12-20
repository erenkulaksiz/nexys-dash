import useSWR from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";

import { setLoading, setUsers } from "@/stores/adminStore";
import { Log, server } from "@/utils";
import { refreshToken, useAuthStore } from "@/stores/authStore";

interface useAdminParams {
  pageType: "users" | "projects";
  uid?: string;
}

export default function useAdmin({ uid, pageType }: useAdminParams) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (adminData.data?.data) {
      adminData.mutate();
    }
  }, [pageType]);

  const adminData = useSWR(
    [`api/dash/admin/${pageType}`],
    async () => {
      const token = Cookies.get("auth");
      return fetch(`${server}/dash/admin`, {
        headers: new Headers({
          "content-type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        }),
        method: "POST",
        body: JSON.stringify({
          uid: uid || user?.uid,
          pageType,
        }),
      })
        .then(async (res) => {
          let json = null;
          try {
            json = await res.json();
          } catch (error) {
            Log.error("useAdmin error json", error);
          }
          if (res.ok) {
            return { success: true, data: json.data };
          }
          return { success: false, error: json.error, data: null };
        })
        .catch((error) => {
          return { success: false, error: error.message, data: null };
        });
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    setLoading(true);
    if (adminData?.data?.error) {
      Log.error("Loading of admin failed", adminData?.data?.error);
      (async () => {
        await refreshToken(true);
        await adminData.mutate();
        //router.reload();
      })();
      setLoading(false);
      return;
    }
    if (typeof adminData?.data == "object") {
      if (adminData?.data != null && typeof adminData?.data?.data != null) {
        if (pageType == "users") {
          setUsers(adminData?.data?.data);
        }
      }
      setLoading(false);
    }
  }, [adminData.data]);

  useEffect(() => {
    if (adminData.isValidating) {
      setLoading(true);
    } else {
      if (adminData?.data?.success == false) return;
      setLoading(false);
    }
  }, [adminData.isValidating]);

  return adminData;
}
