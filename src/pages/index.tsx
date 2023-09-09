import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import ConfettiExplosion from "react-confetti-explosion";

import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import Container from "@/components/Container";
import AddProjectCard from "@/components/home/AddProjectCard";
import AdminCard from "@/components/home/AdminCard";
const ProjectCard = dynamic(() => import("@/components/home/ProjectCard"), {});
import { ValidateToken } from "@/utils/api/validateToken";
import { RiDashboardFill } from "react-icons/ri";
import WithAuth from "@/hocs/withAuth";
import useProjects from "@/hooks/useProjects";
import View from "@/components/View";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps, ProjectTypes } from "@/types";
import type { GetServerSidePropsContext } from "next";

export default function HomePage(props: NexysComponentProps) {
  const router = useRouter();
  const newProject = router.query.newProject == "true" ? true : false;
  const { projects, loading } = useProjects({
    uid: props?.validate?.data?.uid,
  });

  return (
    <Layout {...props} withoutLayout>
      <WithAuth {...props}>
        <Head>
          <title>Nex · Dashboard</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col overflow-y-auto overflow-x-hidden h-full">
          <Navbar />
          <Container>
            <div className="flex flex-row py-4 pb-4 items-center h-full gap-2">
              <RiDashboardFill size={20} />
              <h1 className="text-xl font-semibold">Projects</h1>
            </div>
          </Container>
          <View viewIf={loading}>
            <View.If>
              <div className="flex w-full dark:bg-neutral-900a bg-neutral-100/50a pb-4">
                <Container>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-2 flex-row items-start">
                    {Array.from(Array(6)).map((_, index) => (
                      <div
                        key={index}
                        className="animate-pulse relative group flex items-center justify-center dark:bg-neutral-900 bg-neutral-100 rounded-lg p-4 h-32"
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
                    <View.If
                      visible={
                        Array.isArray(projects?.data?.data) &&
                        projects?.data?.data?.length != 0
                      }
                    >
                      {projects?.data?.data?.map(
                        (project: ProjectTypes, index: number) => (
                          <Link
                            key={project._id?.toString()}
                            href={{
                              pathname: "/project/[id]",
                              query: { id: project.name?.toString() },
                            }}
                          >
                            <ProjectCard project={project} />
                            <View.If
                              visible={
                                projects?.data?.data.length - 1 == index &&
                                newProject
                              }
                            >
                              <ConfettiExplosion
                                force={0.4}
                                duration={2000}
                                particleCount={100}
                                width={1920}
                              />
                            </View.If>
                          </Link>
                        )
                      )}
                    </View.If>
                    <AddProjectCard />
                    {props?.validate?.data?.isAdmin && <AdminCard />}
                  </div>
                </Container>
              </div>
            </View.Else>
          </View>
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
