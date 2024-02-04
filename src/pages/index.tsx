import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import Container from "@/components/Container";
import MagicBorder from "@/components/MagicBorder";
import { FaLightbulb } from "react-icons/fa";
import AddProjectCard from "@/components/Views/home/AddProjectCard";
import AdminCard from "@/components/Views/home/AdminCard";
import ProjectCard from "@/components/Views/home/ProjectCard";
import { ValidateToken } from "@/utils/api/validateToken";
import WithAuth from "@/hocs/withAuth";
import useProjects from "@/hooks/useProjects";
import View from "@/components/View";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps, ProjectTypes } from "@/types";
import type { GetServerSidePropsContext } from "next";

export default function HomePage(props: NexysComponentProps) {
  const router = useRouter();
  const [newProject, setNewProject] = useState<boolean>(false);
  const { projects, loading } = useProjects({
    uid: props?.validate?.data?.uid,
  });

  useEffect(() => {
    setNewProject(router.query.newProject == "true" ? true : false);
  }, [router.query]);

  return (
    <Layout {...props}>
      <WithAuth {...props}>
        <Head>
          <title>Nex · Dashboard</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <div className="flex flex-col w-full h-max">
          <div className="flex flex-col w-full h-screen overflow-auto pt-4">
            <View viewIf={loading}>
              <View.If>
                <div className="flex w-full dark:bg-neutral-900a bg-neutral-100/50a pb-4">
                  <Container>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-2 flex-row items-start">
                      {Array.from(Array(6)).map((_, index) => (
                        <div
                          key={index}
                          className="animate-pulse relative group flex items-center justify-center dark:bg-darker bg-neutral-100 rounded-lg p-4 h-32"
                        ></div>
                      ))}
                    </div>
                  </Container>
                </div>
              </View.If>
              <View.Else>
                <div className="flex w-full dark:bg-neutral-900a bg-neutral-100/50a pb-4">
                  <Container>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-2 flex-row items-start">
                      {projects?.data?.data && !projects?.data?.data.length && (
                        <div className="flex flex-row gap-1 overflow-hidden group items-center justify-center relative dark:bg-darker bg-white rounded-lg p-4 h-32 border-[1px] border-neutral-200 dark:border-dark-border">
                          <FaLightbulb
                            size={180}
                            className="absolute -left-[20px] -bottom-[20px] text-neutral-200/70 dark:text-neutral-900/50 z-10 dark:group-hover:text-neutral-800 group-hover:text-neutral-400 transition-colors duration-200"
                          />
                          <div className="text-center z-20">
                            Create a new project to get started.
                          </div>
                        </div>
                      )}
                      {props?.validate?.data?.isAdmin && <AdminCard />}
                      <View.If
                        visible={
                          Array.isArray(projects?.data?.data) &&
                          projects?.data?.data?.length != 0
                        }
                      >
                        {projects?.data?.data?.map(
                          (project: ProjectTypes, index: number) => (
                            <Link
                              key={project?._id}
                              href={{
                                pathname: "/project/[id]",
                                query: { id: project?.name?.toString() },
                              }}
                              onClick={() => setNewProject(false)}
                            >
                              <View.If visible={index == 0 && newProject}>
                                <ConfettiExplosion
                                  force={0.4}
                                  duration={2000}
                                  particleCount={100}
                                  width={1920}
                                />
                              </View.If>
                              <MagicBorder>
                                <ProjectCard project={project} />
                              </MagicBorder>
                            </Link>
                          )
                        )}
                      </View.If>
                      <AddProjectCard />
                    </div>
                  </Container>
                </div>
              </View.Else>
            </View>
          </div>
          <div className="flex w-full h-[30vh] min-h-[400px] border-t-[1px] dark:border-dark-border border-neutral-200">
            <Container className="flex flex-col gap-10 py-10">
              <h1 className="text-4xl font-semibold">
                Discover Potential of Nexys
              </h1>
              <div className="grid flex-row w-full gap-4 h-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start">
                <div className="flex flex-col h-full border-[1px] border-neutral-200 dark:border-dark-border rounded-lg p-4">
                  <h2 className="text-2xl">AI Insight</h2>
                  <span>
                    Discover error reasons better within click of a button.
                  </span>
                </div>
                <div className="flex flex-col h-full border-[1px] border-neutral-200 dark:border-dark-border rounded-lg p-4">
                  <h2 className="text-2xl">Session Replay</h2>
                  <span>
                    All exceptions have their own sessions. You can watch a
                    session in details.
                  </span>
                </div>
                <div className="flex flex-col h-full border-[1px] border-neutral-200 dark:border-dark-border rounded-lg p-4">
                  <h2 className="text-2xl">Click Track</h2>
                  <span>View a log before it even happens.</span>
                </div>
                <div className="flex flex-col h-full border-[1px] border-neutral-200 dark:border-dark-border rounded-lg p-4">
                  <h2 className="text-2xl">Advanced report</h2>
                  <span>
                    View a report of most occuring errors in your application.
                  </span>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </WithAuth>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  if (ctx.req) {
    const query = ctx.query;

    if (
      query &&
      query?.mode == "resetPassword" &&
      query?.oobCode &&
      query?.apiKey
    ) {
      ctx.res.writeHead(302, {
        Location: `/auth/reset-password?key=${query?.oobCode}`,
      });
      ctx.res.end();
      return { props: {} };
    }

    if (
      query &&
      query?.mode == "verifyEmail" &&
      query?.oobCode &&
      query?.apiKey
    ) {
      ctx.res.writeHead(302, {
        Location: `/auth/verify?key=${query?.oobCode}`,
      });
      ctx.res.end();
      return { props: {} };
    }

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
