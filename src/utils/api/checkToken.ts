import Cookies from "js-cookie";
import { User } from "firebase/auth";

import { Log } from "..";

import type { NexysComponentProps } from "@/types";

export async function CheckToken({
  token,
  props,
  user,
}: {
  token?: string | null;
  props: NexysComponentProps;
  user?: User | null;
}): Promise<boolean> {
  Log.debug("CheckToken", { token, props, user });

  const shouldReload =
    props.validate?.error == "auth/id-token-expired" ||
    props.validate?.error == "auth/argument-error" ||
    props.validate?.error == "validation-error" ||
    (props.validate?.error == "no-token" && user);

  if (shouldReload) {
    if (token) await Cookies.set("auth", token);
    Log.error("Have to reload! checkToken");
    return false;
  }

  return true;
}
