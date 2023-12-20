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
import useBatch from "@/hooks/useBatch";
import Pager from "@/components/Pager";
import View from "@/components/View";
import { MdInfoOutline } from "react-icons/md";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

export default function BatchPage(props: NexysComponentProps) {
  const [page, setPage] = useState<number>(0);
  const router = useRouter();
  const notFound = useProjectStore((state) => state.notFound);
  const loading = useProjectStore((state) => state.loading);
  const batchLoading = useProjectStore((state) => state.batchLoading);
  const project = useProject({ uid: props?.validate?.data?.uid });
  const batch = useBatch({ uid: props?.validate?.data?.uid, page });

  const totalPages = Math.ceil(batch.data?.data?.logsLength / 10);
  const logId = router.query.log as string;
  const projectId = router.query.id;
  const batchId = router.query.batchId;
  const tab = router.query.page?.toString() || "";

  return (
    <Layout {...props}>
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
        <Navbar />
        <div className="flex z-40 w-full flex-row gap-2 items-end py-4 border-b-[1px] border-neutral-200 dark:border-neutral-900">
          <BatchHeader />
        </div>
        <View
          viewIf={
            (batch?.data?.error == "batch/not-found" || notFound) &&
            !batchLoading &&
            !loading
          }
        >
          <View.If>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex flex-col items-center justify-center gap-2">
                <h1 className="text-2xl font-bold">Batch not found</h1>
                <p className="text-lg text-neutral-500 dark:text-neutral-400">
                  The batch you are looking for does not exist
                </p>
              </div>
            </div>
          </View.If>
          <View.Else>
            <Container className="pt-1">
              <View viewIf={loading || batchLoading}>
                <View.If>
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
                </View.If>
                <View.Else>
                  <Tab
                    id="batchpage"
                    defaultTab={props?.query?.page}
                    onTabChange={({ id }) =>
                      router.push(
                        {
                          pathname: `/project/[id]/batch/[batchId]`,
                          query: { ...router.query, page: id },
                        },
                        `/project/${projectId}/batch/${batchId}?page=${id}`,
                        { shallow: true }
                      )
                    }
                    tabChange={tab}
                  >
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
                      id="batch"
                    >
                      <div className="flex flex-col">
                        <View.If
                          hidden={
                            batch.data?.data?.logs?.length == 0 ||
                            totalPages <= 1
                          }
                        >
                          <Pager
                            currentPage={page}
                            totalPages={totalPages}
                            perPage={2}
                            onPageClick={(page) => setPage(page)}
                            onPreviousClick={() =>
                              page != 0 && setPage(page - 1)
                            }
                            onNextClick={() =>
                              page + 1 < totalPages && setPage(page + 1)
                            }
                            className="pt-2"
                          />
                        </View.If>
                        <div className="flex flex-col gap-2 py-2">
                          {batch?.data?.data?.logs
                            ?.sort((a: any, b: any) => b.ts - a.ts)
                            .map((log: any) => {
                              return (
                                <LogCard
                                  log={log}
                                  key={log._id}
                                  logSelected={log?._id?.$oid == logId}
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
                        <div className="flex flex-row items-center gap-1 relative">
                          <MdPersonOutline />
                          <span>User</span>
                          {!batch?.data?.data?.user &&
                            !batch?.data?.data?.config?.client &&
                            !batch?.data?.data?.config?.appVersion &&
                            !batch?.data?.data?.config?.platform && (
                              <MdInfoOutline title="View documentation section 'Configuring' for further information." />
                            )}
                        </div>
                      }
                      id="user"
                      disabled={
                        !batch?.data?.data?.user &&
                        !batch?.data?.data?.config?.client &&
                        !batch?.data?.data?.config?.appVersion &&
                        !batch?.data?.data?.config?.platform
                      }
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="flex flex-col gap-2">
                          <View.If hidden={!batch?.data?.data?.config?.user}>
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="configUser">User</label>
                              <Codeblock data={batch?.data?.data?.config?.user}>
                                {batch?.data?.data?.config?.user}
                              </Codeblock>
                            </div>
                          </View.If>
                          <View.If
                            hidden={!batch?.data?.data?.config?.appVersion}
                          >
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="version">App Version</label>
                              <Codeblock
                                data={batch?.data?.data?.config?.appVersion}
                              >
                                {batch?.data?.data?.config?.appVersion}
                              </Codeblock>
                            </div>
                          </View.If>
                          <View.If
                            hidden={!batch?.data?.data?.config?.platform}
                          >
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="platform">Platform</label>
                              <Codeblock
                                data={batch?.data?.data?.config?.platform}
                              >
                                {batch?.data?.data?.config?.platform}
                              </Codeblock>
                            </div>
                          </View.If>
                        </div>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 pb-2">
                        <div className="flex flex-col gap-2">
                          <View.If
                            hidden={!batch?.data?.data?.deviceData?.userAgent}
                          >
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="userAgent">User Agent</label>
                              <Codeblock
                                data={batch?.data?.data?.deviceData?.userAgent}
                              >
                                {batch?.data?.data?.deviceData?.userAgent}
                              </Codeblock>
                            </div>
                          </View.If>
                          <View.If
                            hidden={!batch?.data?.data?.deviceData?.language}
                          >
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="language">Language</label>
                              <Codeblock
                                data={batch?.data?.data?.deviceData?.language}
                              >
                                {batch?.data?.data?.deviceData?.language}
                              </Codeblock>
                            </div>
                          </View.If>
                          <View.If
                            hidden={!batch?.data?.data?.deviceData?.platform}
                          >
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="platform">Platform</label>
                              <Codeblock
                                data={batch?.data?.data?.deviceData?.platform}
                              >
                                {batch?.data?.data?.deviceData?.platform}
                              </Codeblock>
                            </div>
                          </View.If>
                          <View.If
                            hidden={!batch?.data?.data?.deviceData?.screen}
                          >
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="platform">Screen</label>
                              <Codeblock
                                data={batch?.data?.data?.deviceData?.screen}
                              >
                                <div className="text-xs">
                                  <JSONPretty
                                    data={batch?.data?.data?.deviceData?.screen}
                                  />
                                </div>
                              </Codeblock>
                            </div>
                          </View.If>
                          <View.If
                            hidden={
                              !batch?.data?.data?.deviceData?.deviceMemory
                            }
                          >
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="deviceMemory">
                                Device Memory
                              </label>
                              <div>
                                <Codeblock
                                  data={
                                    batch?.data?.data?.deviceData?.deviceMemory
                                  }
                                >
                                  {batch?.data?.data?.deviceData?.deviceMemory}
                                </Codeblock>
                                <span className="text-sm text-neutral-400">
                                  Due to privacy reasons, the device memory is
                                  ranged between 2 to 8 GB.
                                </span>
                              </div>
                            </div>
                          </View.If>
                          <View.If
                            hidden={!batch?.data?.data?.deviceData?.vendor}
                          >
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="deviceMemory">Vendor</label>
                              <Codeblock
                                data={batch?.data?.data?.deviceData?.vendor}
                              >
                                {batch?.data?.data?.deviceData?.vendor}
                              </Codeblock>
                            </div>
                          </View.If>
                        </div>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="flex flex-col gap-2">
                          <View.If hidden={!batch?.data?.data?.env?.type}>
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="type">Type</label>
                              <Codeblock data={batch?.data?.data?.env?.type}>
                                {batch?.data?.data?.env?.type}
                              </Codeblock>
                            </div>
                          </View.If>
                          <View.If hidden={!batch?.data?.data?.env?.ver}>
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="p_version">NextJS Version</label>
                              <Codeblock data={batch?.data?.data?.env?.ver}>
                                {batch?.data?.data?.env?.ver}
                              </Codeblock>
                            </div>
                          </View.If>
                          <View.If hidden={!batch?.data?.data?.env?.isClient}>
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="isClient">Is Client</label>
                              <Codeblock
                                data={batch?.data?.data?.env?.isClient}
                              >
                                {batch?.data?.data?.env?.isClient
                                  ? "true"
                                  : "false"}
                              </Codeblock>
                            </div>
                          </View.If>
                          <View.If hidden={!batch?.data?.data?.env?.el}>
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="isClient">
                                Body Element Count
                              </label>
                              <div>
                                <Codeblock data={batch?.data?.data?.env?.el}>
                                  {batch?.data?.data?.env?.el}
                                </Codeblock>
                                <span className="text-sm text-neutral-400">
                                  Body Element Count tracks the number of body
                                  elements in the DOM.
                                </span>
                              </div>
                            </div>
                          </View.If>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="flex flex-col gap-2">
                          <View.If
                            hidden={!batch?.data?.data?.package?.libraryName}
                          >
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="package">Package</label>
                              <Codeblock
                                data={batch?.data?.data?.package?.libraryName}
                              >
                                {batch?.data?.data?.package?.libraryName}
                              </Codeblock>
                            </div>
                          </View.If>
                          <View.If
                            hidden={!batch?.data?.data?.package?.version}
                          >
                            <div className="flex flex-col gap-2 w-full">
                              <label htmlFor="version">Version</label>
                              <Codeblock
                                data={batch?.data?.data?.package?.version}
                              >
                                {batch?.data?.data?.package?.version}
                              </Codeblock>
                            </div>
                          </View.If>
                        </div>
                      </div>
                    </Tab.TabView>
                    {props.validate?.data?.isAdmin && (
                      <Tab.TabView
                        activeTitle={
                          <div className="flex flex-row items-center gap-1">
                            <IoMdSettings />
                            <span>Package Options</span>
                          </div>
                        }
                        nonActiveTitle={
                          <div className="flex flex-row items-center gap-1">
                            <IoSettingsOutline />
                            <span>Package Options</span>
                          </div>
                        }
                        id="options"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex flex-col">
                                <label htmlFor="poptions">
                                  Package Options
                                </label>
                                <span className="text-sm text-neutral-400">
                                  Configured library options. This section is
                                  used Nexys internally and may be to debugging
                                  the options used by the library.
                                </span>
                              </div>
                              <Codeblock data={batch?.data?.data?.options}>
                                <div className="text-xs">
                                  <JSONPretty
                                    data={batch?.data?.data?.options}
                                  />
                                </div>
                              </Codeblock>
                            </div>
                          </div>
                        </div>
                      </Tab.TabView>
                    )}
                  </Tab>
                </View.Else>
              </View>
            </Container>
          </View.Else>
        </View>
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
