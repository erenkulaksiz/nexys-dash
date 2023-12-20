import Head from "next/head";
import CountUp from "react-countup";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import { server, Log } from "@/utils";
import View from "@/components/View";
import Layout from "@/components/Layout";
import AddProject from "@/components/AddProject";
import { ValidateToken } from "@/utils/api/validateToken";
import WithAuth from "@/hocs/withAuth";
import { useAuthStore } from "@/stores/authStore";
import { MdError, MdInfo } from "react-icons/md";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

export default function NewProjectPage(props: NexysComponentProps) {
  const authUser = useAuthStore((state) => state.user);
  const uid = props?.validate?.data?.uid || authUser?.uid;
  const [totalsLoading, setTotalsLoading] = useState(false);
  const totals = useSWR("api/dash/project/totalLogs", async () => {
    const token = Cookies.get("auth");
    return fetch(`${server}/v1/dash/count`, {
      headers: new Headers({
        "content-type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      }),
      method: "POST",
      body: JSON.stringify({
        uid: uid || authUser?.uid,
      }),
    })
      .then(async (res) => {
        let json = null;
        try {
          json = await res.json();
        } catch (error) {
          Log.error("count error json", error);
        }
        if (res.ok) {
          return { success: true, data: json.data };
        }
        return { success: false, error: json.error, data: null };
      })
      .catch((error) => {
        return { success: false, error: error.message, data: null };
      });
  });

  useEffect(() => {
    if (totals.isValidating) {
      setTotalsLoading(true);
    } else {
      setTotalsLoading(false);
    }
  }, [totals.isValidating]);

  console.log("totals", totals);

  return (
    <Layout withoutLayout {...props}>
      <WithAuth {...props}>
        <Head>
          <title>Nex · New Project</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar />
        <Container>
          <div className="flex flex-col py-2 sm:py-8 justify-center">
            <h1 className="text-2xl sm:text-4xl font-semibold">
              {"Let's get you started."}
            </h1>
            <h2 className="dark:text-neutral-400 text-neutral-500">
              {"Your new project will be flawless with Nexys."}
            </h2>
          </div>
        </Container>
        <Container>
          <div className="w-full grid sm:grid-cols-2 grid-cols-1 items-start gap-2">
            <AddProject />
            <div className="dark:shadow-neutral-900 flex flex-col gap-2 justify-between dark:bg-black bg-white rounded-lg p-4 border-[1px] border-neutral-200 dark:border-neutral-900">
              <div className="text-2xl">total of</div>
              <div className="flex flex-row gap-1 items-end">
                <View viewIf={totalsLoading}>
                  <View.If>
                    <div className="h-10 w-[140px] dark:bg-neutral-900 bg-neutral-200 animate-pulse mr-1"></div>
                  </View.If>
                  <View.Else>
                    <div className="flex flex-row text-4xl items-end font-semibold dark:text-red-800 text-red-600">
                      <MdError size={18} />
                      <CountUp
                        end={totals.data?.data?.totalErrorCount ?? 0}
                        duration={0.8}
                      />
                    </div>
                  </View.Else>
                </View>
                <div>errors caught</div>
              </div>
              <div className="flex flex-row gap-1 items-end">
                <View viewIf={totalsLoading}>
                  <View.If>
                    <div className="h-10 w-[140px] dark:bg-neutral-900 bg-neutral-200 animate-pulse mr-1"></div>
                  </View.If>
                  <View.Else>
                    <div className="flex flex-row text-4xl items-end font-semibold text-neutral-600 dark:text-neutral-500">
                      <MdInfo size={18} />
                      <CountUp
                        end={totals.data?.data?.totalLogCount ?? 0}
                        duration={0.8}
                      />
                    </div>
                  </View.Else>
                </View>
                <div>logs processed</div>
              </div>
            </div>
          </div>
        </Container>
      </WithAuth>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  if (ctx.req) {
    validate = await ValidateToken({ token: ctx.req.cookies.auth });
    if (validate.success) {
      return { props: { validate } };
    } else if (!validate.success) {
      if (validate.error == "auth/email-not-verified") {
        ctx.res.writeHead(302, { Location: "/auth/verify" });
        ctx.res.end();
        return { props: { validate } };
      } else {
        ctx.res.writeHead(302, { Location: "/auth/signin" });
        ctx.res.end();
        return { props: { validate } };
      }
    }
  }
  return { props: { validate } };
}
