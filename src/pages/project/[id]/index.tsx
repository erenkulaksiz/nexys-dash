import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import Head from "next/head";

import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import Tab from "@/components/Tab";
import Header from "@/components/project/Header";
import Tabs from "@/components/project/Tabs";
import WithAuth from "@/hocs/withAuth";
import { ValidateToken } from "@/utils/api/validateToken";
import { Log, server } from "@/utils";
import { refreshToken } from "@/stores/authStore";
import {
  setCurrentProject,
  setNotFound,
  setProjectLoading,
  useProjectStore,
} from "@/stores/projectStore";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { GetServerSidePropsContext } from "next";
import type { NexysComponentProps } from "@/types";

export default function ProjectPage(props: NexysComponentProps) {
  const router = useRouter();
  const notFound = useProjectStore((state) => state.notFound);
  const projectLoading = useProjectStore((state) => state.loading);

  const query = router.query.id?.toString() || "";

  const _project = useSWR([`api/dash/project/data/${query}`], async () => {
    const token = Cookies.get("auth");
    return fetch(`${server}/api/dash/project/data`, {
      headers: new Headers({
        "content-type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      }),
      method: "POST",
      body: JSON.stringify({
        uid: props?.validate?.data.uid,
        id: query,
      }),
    })
      .then(async (res) => {
        let json = null;
        try {
          json = await res.json();
        } catch (error) {
          Log.error("LogPage error json", error);
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
    setProjectLoading(true);
    if (_project?.data?.error) {
      Log.error("Loading of project failed", _project?.data?.error);
      if (
        _project?.data?.error == "auth/id-token-expired" ||
        _project?.data?.error == "auth-uid-error"
      ) {
        (async () => {
          await refreshToken(true);
          await _project.mutate();
          router.reload();
        })();
        return;
      }
      setNotFound(true);
      setProjectLoading(false);
      return;
    }
    if (typeof _project?.data == "object") {
      if (_project?.data != null && typeof _project?.data?.data != null) {
        setCurrentProject(_project?.data?.data);
        setNotFound(false);
      }
      setProjectLoading(false);
    }
  }, [_project.data]);

  return (
    <Layout {...props} withoutLayout>
      <WithAuth {...props}>
        <Head>
          <title>
            {projectLoading
              ? "Loading..."
              : notFound
              ? "Not Found"
              : `${_project?.data?.data?.name} - Nexys`}
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col overflow-y-auto h-full">
          <Navbar />
          {projectLoading && (
            <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
              <Loading size="xl" />
              <span>Loading project...</span>
            </div>
          )}
          {notFound && (
            <div className="flex flex-col items-center justify-center h-1/2">
              <h1 className="text-2xl font-semibold">Project not found</h1>
              <h2 className="text-neutral-500">
                The project you are looking for does not exist
              </h2>
            </div>
          )}
          {!notFound && !projectLoading && (
            <>
              <Header />
              <Container className="pt-1">
                <Tab id="dashboard">
                  {Tabs.map((tab) => (
                    <Tab.TabView
                      activeTitle={tab.activeTitle}
                      nonActiveTitle={tab.nonActiveTitle}
                      id={tab.id}
                      key={tab.id}
                      disabled={tab?.disabled}
                    >
                      {tab.children}
                    </Tab.TabView>
                  ))}
                </Tab>
              </Container>
            </>
          )}
        </main>
      </WithAuth>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  if (ctx.req) {
    validate = await ValidateToken({ token: ctx.req.cookies.auth });
    if (validate.success) {
      if (!validate.data.emailVerified) {
        ctx.res.writeHead(302, { Location: "/auth/verify" });
        ctx.res.end();
        return { props: { validate } };
      }
      return { props: { validate } };
    }
  }
  return { props: { validate } };
}
