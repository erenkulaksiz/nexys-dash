import Head from "next/head";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import Tab from "@/components/Tab";
import Header from "@/components/project/Header";
import Tabs from "@/components/project/Tabs";
import WithAuth from "@/hocs/withAuth";
import { Log } from "@/utils";
import { ValidateToken } from "@/utils/api/validateToken";
import { useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import useProject from "@/hooks/useProject";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { GetServerSidePropsContext } from "next";
import type { NexysComponentProps } from "@/types";

export default function ProjectPage(props: NexysComponentProps) {
  const notFound = useProjectStore((state) => state.notFound);
  const projectLoading = useProjectStore((state) => state.loading);
  const authUser = useAuthStore((state) => state.validatedUser);
  const uid = props?.validate?.data?.uid || authUser?.uid;
  const project = useProject({ uid: uid ?? "" });

  const router = useRouter();
  const query = router.query.id?.toString() || "";

  return (
    <Layout {...props} withoutLayout>
      <WithAuth {...props}>
        <Head>
          <title>
            {projectLoading
              ? "Loading..."
              : notFound
              ? "Not Found"
              : `Nex · ${project?.data?.data?.name}`}
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col overflow-y-auto overflow-x-hidden h-full">
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
                <Tab
                  id="dashboard"
                  onTabChange={({ id, index }) => {
                    Log.debug("Tab changed", index, id);
                    /*
                    router.push(
                      {
                        pathname: `/project/[id]`,
                        query,
                      },
                      `/project/${query}?p=${id}`,
                      { shallow: true }
                    );
                    */
                  }}
                >
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
