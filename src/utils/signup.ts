import { Log, server } from "@/utils";

export interface signupParams {
  email: string;
  password: string;
  username: string;
}

export interface signupReturnTypes {
  success: boolean;
  data?: any;
  error?: any;
}

export async function signup({
  email,
  password,
  username,
}: signupParams): Promise<signupReturnTypes> {
  return await fetch(`${server}/api/v1/dash/auth/signup`, {
    headers: new Headers({
      "content-type": "application/json",
    }),
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  })
    .then(async (response) => {
      if (response.ok) {
        return { success: true };
      } else {
        const json = await response.json();
        throw new Error(json.error);
      }
    })
    .catch((error) => {
      return { error, success: false };
    });
}
