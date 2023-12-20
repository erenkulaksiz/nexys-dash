import { server, Log } from "@/utils";

interface hookRequestParams {
  url: string;
  data?: any;
  token?: string;
}

export default function hookRequest({ url, data, token }: hookRequestParams) {
  return fetch(`${server}${url}`, {
    headers: new Headers({
      "content-type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    }),
    method: "POST",
    body: JSON.stringify({ ...data }),
  })
    .then(async (res) => {
      let json = null;
      try {
        json = await res.json();
      } catch (error) {
        Log.error("hookRequest error json", url, error);
      }
      if (res.ok) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error, data: null };
    })
    .catch((error) => {
      return { success: false, error: error.message, data: null };
    });
}
