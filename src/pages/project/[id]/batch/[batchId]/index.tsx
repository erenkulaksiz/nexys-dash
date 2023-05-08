import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
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
import useBatch from "@/hooks/useBatch";
import { BuildComponent } from "@/utils/style";
import Pager from "@/components/Pager";
import { Log } from "@/utils";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

export default function BatchPage(props: NexysComponentProps) {
  const [page, setPage] = useState<number>(0);
  const router = useRouter();
  const notFound = useProjectStore((state) => state.notFound);
  const loading = useProjectStore((state) => state.loading);
  const batchLoading = useProjectStore((state) => state.batchLoading);
  const authUser = useAuthStore((state) => state.validatedUser);
  const uid = props?.validate?.data?.uid || authUser?.uid;
  const project = useProject({ uid: uid ?? "" });
  const batch = useBatch({ uid: uid ?? "", page });

  const totalPages = Math.ceil(batch.data?.data?.logsLength / 10);
  const logId = router.query.log as string;

  return (
    <Layout {...props} withoutLayout>
      <WithAuth {...props}>
        <Head>
          <title>
            {loading
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
          {!batch?.data?.data && !batchLoading && !loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex flex-col items-center justify-center gap-2">
                <h1 className="text-2xl font-bold">Batch not found</h1>
                <p className="text-lg text-neutral-500 dark:text-neutral-400">
                  The batch you are looking for does not exist
                </p>
              </div>
            </div>
          )}
          <Container className="pt-1">
            {(loading || batchLoading) && (
              <div className="animate-pulse flex flex-col w-full gap-2 pt-1">
                <div className="flex flex-row gap-2">
                  {Array.from(Array(6)).map((_, index) => (
                    <div
                      key={index}
                      className="bg-neutral-100 dark:bg-neutral-900 p-3 px-10"
                    ></div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex w-full h-[400px] bg-neutral-100 dark:bg-neutral-900"></div>
                  <div className="flex w-full h-[400px] bg-neutral-100 dark:bg-neutral-900"></div>
                </div>
              </div>
            )}
            {!loading && !batchLoading && (
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
                  <div className="flex flex-col">
                    <div className="flex flex-row flex-wrap gap-2 items-start pt-2">
                      {batch?.data?.data?.logTypes &&
                        Object.keys(batch?.data?.data?.logTypes)
                          .sort((a: any, b: any) => {
                            return batch?.data?.data?.logTypes[a] >
                              batch?.data?.data?.logTypes[b]
                              ? -1
                              : 1;
                          })
                          .map((batchType: any) => {
                            return (
                              <li
                                key={`batchCard-${batchType}`}
                                className={
                                  BuildComponent({
                                    defaultClasses:
                                      "flex flex-row gap-2 items-center border-[1px] px-1 rounded",
                                    conditionalClasses: [
                                      {
                                        true: "border-red-400 dark:border-red-800",
                                        false:
                                          "border-neutral-200 dark:border-neutral-900",
                                      },
                                    ],
                                    selectedClasses: [
                                      batchType == "ERROR" ||
                                        batchType == "AUTO:ERROR" ||
                                        batchType == "AUTO:UNHANDLEDREJECTION",
                                    ],
                                  }).classes
                                }
                              >
                                <div className="flex flex-row gap-[2px] items-center">
                                  <span className="text-sm">
                                    {batchType != "undefined"
                                      ? batchType
                                      : "LOG"}
                                  </span>
                                  <span className="text-neutral-500 text-xs">
                                    ({batch?.data?.data?.logTypes[batchType]})
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                    </div>
                    {batch.data?.data?.logs?.length != 0 && totalPages > 1 && (
                      <Pager
                        currentPage={page}
                        totalPages={totalPages}
                        perPage={2}
                        onPageClick={(page) => setPage(page)}
                        onPreviousClick={() => page != 0 && setPage(page - 1)}
                        onNextClick={() =>
                          page + 1 < totalPages && setPage(page + 1)
                        }
                        className="pt-2"
                      />
                    )}
                    <div className="flex flex-col gap-2 py-2">
                      {batch?.data?.data?.logs
                        ?.sort((a: any, b: any) => b.ts - a.ts)
                        .map((log: any) => {
                          return (
                            <LogCard
                              log={log}
                              key={log._id}
                              logSelected={log._id == logId}
                              viewingBatch
                            />
                          );
                        })}
                    </div>
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
                        <Codeblock data={batch?.data?.data?.config?.user}>
                          {batch?.data?.data?.config?.user}
                        </Codeblock>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="configClient">Client</label>
                        <Codeblock data={batch?.data?.data?.config?.client}>
                          {batch?.data?.data?.config?.client}
                        </Codeblock>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="version">App Version</label>
                        <Codeblock data={batch?.data?.data?.config?.appVersion}>
                          {batch?.data?.data?.config?.appVersion}
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
                          data={batch?.data?.data?.deviceData?.userAgent}
                        >
                          {batch?.data?.data?.deviceData?.userAgent}
                        </Codeblock>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="language">Language</label>
                        <Codeblock
                          data={batch?.data?.data?.deviceData?.language}
                        >
                          {batch?.data?.data?.deviceData?.language}
                        </Codeblock>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="platform">Platform</label>
                        <Codeblock
                          data={batch?.data?.data?.deviceData?.platform}
                        >
                          {batch?.data?.data?.deviceData?.platform}
                        </Codeblock>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="platform">Screen</label>
                        <Codeblock data={batch?.data?.data?.deviceData?.screen}>
                          <div className="text-xs">
                            <JSONPretty
                              data={batch?.data?.data?.deviceData?.screen}
                            />
                          </div>
                        </Codeblock>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="deviceMemory">Device Memory</label>
                        <Codeblock
                          data={batch?.data?.data?.deviceData?.deviceMemory}
                        >
                          {batch?.data?.data?.deviceData?.deviceMemory}
                        </Codeblock>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="deviceMemory">Vendor</label>
                        <Codeblock data={batch?.data?.data?.deviceData?.vendor}>
                          {batch?.data?.data?.deviceData?.vendor}
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
                        <Codeblock data={batch?.data?.data?.env?.type}>
                          {batch?.data?.data?.env?.type}
                        </Codeblock>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="p_version">Version</label>
                        <Codeblock data={batch?.data?.data?.env?.ver}>
                          {batch?.data?.data?.env?.ver}
                        </Codeblock>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="isClient">Is Client</label>
                        <Codeblock data={batch?.data?.data?.env?.isClient}>
                          {batch?.data?.data?.env?.isClient ? "true" : "false"}
                        </Codeblock>
                      </div>
                      {batch?.data?.data?.env?.el && (
                        <div className="flex flex-col gap-2 w-full">
                          <label htmlFor="isClient">Body Element Count</label>
                          <Codeblock data={batch?.data?.data?.env?.el}>
                            {batch?.data?.data?.env?.el}
                          </Codeblock>
                        </div>
                      )}
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
                          data={batch?.data?.data?.package?.libraryName}
                        >
                          {batch?.data?.data?.package?.libraryName}
                        </Codeblock>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="version">Version</label>
                        <Codeblock data={batch?.data?.data?.package?.version}>
                          {batch?.data?.data?.package?.version}
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
                        <Codeblock data={batch?.data?.data?.options}>
                          <div className="text-xs">
                            <JSONPretty data={batch?.data?.data?.options} />
                          </div>
                        </Codeblock>
                      </div>
                    </div>
                  </div>
                </Tab.TabView>
              </Tab>
            )}
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
