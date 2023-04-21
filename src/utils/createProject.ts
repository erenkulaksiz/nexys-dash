import { getAuth } from "firebase/auth";
import { server } from "@/utils";

import type { ProjectTypes } from "@/types";

interface CreateProjectParams extends ProjectTypes {
  uid?: string;
}

export async function createProject(
  project: CreateProjectParams
): Promise<{ success: boolean; error?: string }> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  return await fetch(`${server}/api/dash/project/create`, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    }),
    body: JSON.stringify(project),
  })
    .then(async (res) => {
      let json: any;
      try{
        json = await res.json();
      } catch(err){}
      if (res.ok) {
        return { success: true };
      }
      throw new Error(json.error);
    })
    .catch((error: Error) => {
      return { success: false, error: error.message };
    });
}
