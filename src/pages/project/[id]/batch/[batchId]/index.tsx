import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { MdPerson, MdPersonOutline } from "react-icons/md";
import {
  RiFilePaperLine,
  RiFilePaperFill,
  RiDeviceLine,
  RiDeviceFill,
} from "react-icons/ri";
import { HiServer, HiOutlineServer } from "react-icons/hi";
import { HiInbox, HiOutlineInbox } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import JSONPretty from "react-json-pretty";

import Container from "@/components/Container";
import Tab from "@/components/Tab";
import Codeblock from "@/components/Codeblock";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import LogCard from "@/components/project/LogCard";
import WithAuth from "@/hocs/withAuth";
import useProject from "@/hooks/useProject";
import BatchHeader from "@/components/project/BatchHeader";
import { ValidateToken } from "@/utils/api/validateToken";
import { useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import { Log } from "@/utils";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

export default function BatchPage(props: NexysComponentProps) {
  const notFound = useProjectStore((state) => state.notFound);
  const projectLoading = useProjectStore((state) => state.loading);
  const authUser = useAuthStore((state) => state.validatedUser);
  const uid = props?.validate?.data?.uid || authUser?.uid;
  const project = useProject({ uid: uid ?? "" });
  const router = useRouter();

  const { batchId, logGuid } = router.query;

  const currentBatch = useMemo(
    () => project?.data?.data?.logs?.find((batch: any) => batch._id == batchId),
    [project?.data?.data?.logs, batchId]
  );

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
          <div className="flex z-40 flex-row gap-2 items-end py-4 border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <BatchHeader />
          </div>
          {!currentBatch && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex flex-col items-center justify-center gap-2">
                <h1 className="text-2xl font-bold">Batch not found</h1>
                <p className="text-lg text-neutral-500 dark:text-neutral-400">
                  The batch you are looking for does not exist
                </p>
              </div>
            </div>
          )}
          <Container className="pt-1" hidden={currentBatch == null}>
            <Tab id="batchpage">
              <Tab.TabView
                activeTitle={
                  <div className="flex flex-row items-center gap-1">
                    <RiFilePaperFill />
                    <span>Batch</span>
                  </div>
                }
                nonActiveTitle={
                  <div className="flex flex-row items-center gap-1">
                    <RiFilePaperLine />
                    <span>Batch</span>
                  </div>
                }
                id="Batch"
              >
                <div className="flex flex-col gap-2 py-2">
                  {currentBatch?.data?.logs
                    ?.sort((a: any, b: any) => b.ts - a.ts)
                    .map((log: any) => {
                      return (
                        <LogCard
                          log={log}
                          data={project?.data?.data}
                          key={log.guid}
                          logSelected={logGuid == log.guid}
                          viewingBatch
                        />
                      );
                    })}
                </div>
              </Tab.TabView>
              <Tab.TabView
                activeTitle={
                  <div className="flex flex-row items-center gap-1">
                    <MdPerson />
                    <span>User</span>
                  </div>
                }
                nonActiveTitle={
                  <div className="flex flex-row items-center gap-1">
                    <MdPersonOutline />
                    <span>User</span>
                  </div>
                }
                id="user"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="configUser">User</label>
                      <Codeblock data={currentBatch?.data?.config?.user}>
                        {currentBatch?.data?.config?.user}
                      </Codeblock>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="configClient">Client</label>
                      <Codeblock data={currentBatch?.data?.config?.client}>
                        {currentBatch?.data?.config?.client}
                      </Codeblock>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="version">App Version</label>
                      <Codeblock data={currentBatch?.data?.config?.appVersion}>
                        {currentBatch?.data?.config?.appVersion}
                      </Codeblock>
                    </div>
                  </div>
                  <div></div>
                </div>
              </Tab.TabView>
              <Tab.TabView
                activeTitle={
                  <div className="flex flex-row items-center gap-1">
                    <RiDeviceFill />
                    <span>Device</span>
                  </div>
                }
                nonActiveTitle={
                  <div className="flex flex-row items-center gap-1">
                    <RiDeviceLine />
                    <span>Device</span>
                  </div>
                }
                id="device"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="userAgent">User Agent</label>
                      <Codeblock
                        data={currentBatch?.data?.deviceData?.userAgent}
                      >
                        {currentBatch?.data?.deviceData?.userAgent}
                      </Codeblock>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="language">Language</label>
                      <Codeblock
                        data={currentBatch?.data?.deviceData?.language}
                      >
                        {currentBatch?.data?.deviceData?.language}
                      </Codeblock>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="platform">Platform</label>
                      <Codeblock
                        data={currentBatch?.data?.deviceData?.platform}
                      >
                        {currentBatch?.data?.deviceData?.platform}
                      </Codeblock>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="platform">Screen</label>
                      <Codeblock data={currentBatch?.data?.deviceData?.screen}>
                        <div className="text-xs">
                          <JSONPretty
                            data={currentBatch?.data?.deviceData?.screen}
                          />
                        </div>
                      </Codeblock>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="deviceMemory">Device Memory</label>
                      <Codeblock
                        data={currentBatch?.data?.deviceData?.deviceMemory}
                      >
                        {currentBatch?.data?.deviceData?.deviceMemory}
                      </Codeblock>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="deviceMemory">Vendor</label>
                      <Codeblock data={currentBatch?.data?.deviceData?.vendor}>
                        {currentBatch?.data?.deviceData?.vendor}
                      </Codeblock>
                    </div>
                  </div>
                  <div></div>
                </div>
              </Tab.TabView>
              <Tab.TabView
                activeTitle={
                  <div className="flex flex-row items-center gap-1">
                    <HiServer />
                    <span>Environment</span>
                  </div>
                }
                nonActiveTitle={
                  <div className="flex flex-row items-center gap-1">
                    <HiOutlineServer />
                    <span>Environment</span>
                  </div>
                }
                id="env"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="type">Type</label>
                      <Codeblock data={currentBatch?.data?.env?.type}>
                        {currentBatch?.data?.env?.type}
                      </Codeblock>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="p_version">Version</label>
                      <Codeblock data={currentBatch?.data?.env?.ver}>
                        {currentBatch?.data?.env?.ver}
                      </Codeblock>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="isClient">Is Client</label>
                      <Codeblock data={currentBatch?.data?.env?.isClient}>
                        {currentBatch?.data?.env?.isClient ? "true" : "false"}
                      </Codeblock>
                    </div>
                  </div>
                </div>
              </Tab.TabView>
              <Tab.TabView
                activeTitle={
                  <div className="flex flex-row items-center gap-1">
                    <HiInbox />
                    <span>Package</span>
                  </div>
                }
                nonActiveTitle={
                  <div className="flex flex-row items-center gap-1">
                    <HiOutlineInbox />
                    <span>Package</span>
                  </div>
                }
                id="package"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="package">Package</label>
                      <Codeblock
                        data={currentBatch?.data?.package?.libraryName}
                      >
                        {currentBatch?.data?.package?.libraryName}
                      </Codeblock>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="version">Version</label>
                      <Codeblock data={currentBatch?.data?.package?.version}>
                        {currentBatch?.data?.package?.version}
                      </Codeblock>
                    </div>
                  </div>
                </div>
              </Tab.TabView>
              <Tab.TabView
                activeTitle={
                  <div className="flex flex-row items-center gap-1">
                    <IoMdSettings />
                    <span>Options</span>
                  </div>
                }
                nonActiveTitle={
                  <div className="flex flex-row items-center gap-1">
                    <IoSettingsOutline />
                    <span>Options</span>
                  </div>
                }
                id="options"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex flex-col">
                        <label htmlFor="poptions">Options</label>
                        <span className="text-sm text-neutral-400">
                          Package options.
                        </span>
                      </div>
                      <Codeblock data={currentBatch?.data?.options}>
                        <div className="text-xs">
                          <JSONPretty data={currentBatch?.data?.options} />
                        </div>
                      </Codeblock>
                    </div>
                  </div>
                </div>
              </Tab.TabView>
            </Tab>
          </Container>
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
