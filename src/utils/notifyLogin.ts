import { server } from "./server";
import { Log } from "./logger";

export async function NotifyLogin(token?: string) {
  if (!token) return;
  await fetch(`${server}/api/user/login`, {
    method: "POST",
    headers: new Headers({ "content-type": "application/json" }),
    body: JSON.stringify({ token }),
  }).catch((error) => Log.error(error));
}
