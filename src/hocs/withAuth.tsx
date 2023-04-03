import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { isClient, Log } from "@/utils";
import { LoadingState } from "@/hocs";
import { useAuthStore } from "@/stores/authStore";
import type { NexysComponentProps } from "@/types";

export function WithAuth(props: NexysComponentProps) {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.authLoading);
  const validatedUser = useAuthStore((state) => state.validatedUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !authUser && isClient()) {
      if (router.pathname !== "/auth/signin") {
        window.location.href = "/auth/signin";
        return setLoading(true);
      }
    }

    if (!authLoading && authUser) {
      if (!authUser?.emailVerified) {
        if (router.pathname !== "/auth/verify") {
          window.location.href = "/auth/verify";
          return setLoading(true);
        }
      }
      return setLoading(false);
    }
  }, [authLoading, validatedUser]);

  if (loading) return <LoadingState />;

  return <>{props.children}</>;
}
