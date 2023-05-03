import { getAuth } from "firebase/auth";
import { server } from "@/utils";

export async function projectSetting({
  id,
  uid,
  localhostAccess,
}: {
  id: string;
  uid: string;
  localhostAccess?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  return await fetch(`${server}/api/dash/project/setting`, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    }),
    body: JSON.stringify({ id, uid, localhostAccess }),
  })
    .then(async (res) => {
      if (res.ok) {
        return { success: true };
      }
      const json = await res.json();
      throw new Error(JSON.stringify(json));
    })
    .catch((error: Error) => {
      return { success: false, error: error.message };
    });
}
