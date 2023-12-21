import React from "react";
import { useRouter } from "next/router";

import { isClient, Log } from "@/utils";
import { LoadingState } from "@/hocs";
import { useAuthStore } from "@/stores/authStore";
import type { NexysComponentProps } from "@/types";

export default function WithoutAuth(props: NexysComponentProps) {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.authLoading);

  //if (auth?.authLoading) return <LoadingOverlay />;

  console.log("authUser2", authUser, authLoading, isClient());

  return <>{props.children}</>;
}
