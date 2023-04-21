import React from "react";
import { useRouter } from "next/router";

import { isClient, Log } from "@/utils";
import { LoadingState } from "@/hocs";
import { useAuthStore } from "@/stores/authStore";
import type { NexysComponentProps } from "@/types";

export function WithoutAuth(props: NexysComponentProps) {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.authLoading);

  //if (auth?.authLoading) return <LoadingOverlay />;

  if (!authLoading && authUser && isClient()) {
    if (!authUser?.emailVerified) {
      router.push("/auth/verify");
      return <LoadingState />;
    }

    if (router.pathname !== "/") {
      window.location.href = "/";
      return <LoadingState />;
    }
  }

  return <>{props.children}</>;
}
