import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import { MdOutlineArrowBack } from "react-icons/md";

import Button from "@/components/Button";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Tab from "@/components/Tab";
import Header from "@/components/Views/project/Header";
import Tabs from "@/components/Views/project/Tabs";
import WithAuth from "@/hocs/withAuth";
import View from "@/components/View";
import { ValidateToken } from "@/utils/api/validateToken";
import { setAIInsightModal, useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import useProject from "@/hooks/useProject";
const AIInsightModal = dynamic(() => import("@/components/Modals/AIInsight"), {
  ssr: false,
});
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { GetServerSidePropsContext } from "next";
import type { NexysComponentProps } from "@/types";

export default function ProjectPage(props: NexysComponentProps) {
  const notFound = useProjectStore((state) => state.notFound);
  const loading = useProjectStore((state) => state.loading);
  const authUser = useAuthStore((state) => state.user);
  const uid = props?.validate?.data?.uid || authUser?.uid;
  const project = useProject({ uid: uid ?? "" });
  const AIInsightModalState = useProjectStore((state) => state.aiInsightModal);

  const router = useRouter();
  const query = router.query.id?.toString() || "";
  const tab = router.query.page?.toString() || "";

  return (
    <Layout {...props}>
      <WithAuth {...props}>
        <Head>
          <title>
            {loading
              ? "Nex · Loading..."
              : notFound
              ? "Nex · Not Found"
              : `Nex · ${project?.data?.data?.name}`}
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <View viewIf={notFound}>
          <View.If>
            <div className="flex flex-col gap-2 items-center justify-center h-1/2">
              <h1 className="text-6xl font-semibold">404</h1>
              <h1 className="text-2xl">Project not found</h1>
              <h2 className="text-neutral-500 mb-2">
                The project you are looking for does not exist
              </h2>
              <Link href="/">
                <Button
                  light="dark:bg-white bg-black dark:text-black"
                  className="px-4 text-white"
                >
                  <MdOutlineArrowBack size={18} />
                  <span className="ml-2">Back</span>
                </Button>
              </Link>
            </div>
          </View.If>
          <View.Else>
            <Header />
            <Container className="pt-1">
              <View viewIf={loading}>
                <View.If>
                  <div className="animate-pulse flex flex-col w-full gap-2 pt-1">
                    <div className="flex flex-row gap-2">
                      {Array.from(Array(6)).map((_, index) => (
                        <div
                          key={index}
                          className="bg-neutral-100 dark:bg-darker p-3 px-10"
                        ></div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex w-full h-[400px] bg-neutral-100 dark:bg-darker"></div>
                      <div className="flex w-full h-[400px] bg-neutral-100 dark:bg-darker"></div>
                    </div>
                  </div>
                </View.If>
                <View.Else>
                  <Tab
                    id="dashboard"
                    defaultTab={props?.query?.page}
                    onTabChange={({ id }) =>
                      router.push(
                        {
                          pathname: `/project/[id]`,
                          query,
                        },
                        `/project/${query}?page=${id}`,
                        { shallow: true }
                      )
                    }
                    tabChange={tab}
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
                </View.Else>
              </View>
            </Container>
          </View.Else>
        </View>
        <AIInsightModal
          isOpen={AIInsightModalState.isOpen}
          onClose={() => {
            setAIInsightModal({
              isOpen: false,
              logId: "",
            });
          }}
        />
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
