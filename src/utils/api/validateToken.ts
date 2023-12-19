import { server } from "@/utils";
export interface ValidateTokenReturnType {
  success: boolean;
  error?: string;
  data?: any; // #TODO: define data type
}

export async function ValidateToken({
  token,
}: {
  token?: string;
}): Promise<ValidateTokenReturnType> {
  return await fetch(`${server}/api/v1/dash/auth/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(({ data, error }) => {
      if (error) throw new Error(error);
      return {
        success: true,
        data,
      };
    })
    .catch((error) => {
      return { success: false, error: error.message, data: null };
    });
}
