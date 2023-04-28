import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ConfettiExplosion from "react-confetti-explosion";

import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import AddProjectCard from "@/components/home/AddProjectCard";
import ProjectCard from "@/components/home/ProjectCard";
import { useAuthStore } from "@/stores/authStore";
import { ValidateToken } from "@/utils/api/validateToken";
import { RiDashboardFill } from "react-icons/ri";
import WithAuth from "@/hocs/withAuth";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps, ProjectTypes } from "@/types";
import type { GetServerSidePropsContext } from "next";
import useProjects from "@/hooks/useProjects";

export default function HomePage(props: NexysComponentProps) {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const newProject = router.query.newProject == "true" ? true : false;
  const uid = props?.validate?.data?.uid || authUser?.uid;
  const { projects, loading } = useProjects({ uid });

  return (
    <Layout {...props} withoutLayout>
      <WithAuth {...props}>
        <Head>
          <title>Nexys Dashboard</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col overflow-y-auto overflow-x-hidden h-full">
          <Navbar />
          {loading ? (
            <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
              <Loading size="xl" />
              <span>Loading projects...</span>
            </div>
          ) : (
            <>
              <Container>
                <div className="flex flex-row py-4 pb-4 items-center h-full gap-2">
                  <RiDashboardFill size={20} />
                  <h1 className="text-xl font-semibold">Projects</h1>
                </div>
              </Container>
              <div className="flex w-full dark:bg-neutral-900a bg-neutral-100/50a pb-4">
                <Container>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-2 flex-row items-start">
                    {!loading &&
                      Array.isArray(projects?.data?.data) &&
                      projects?.data?.data.length != 0 &&
                      projects?.data?.data.map(
                        (project: ProjectTypes, index) => (
                          <Link
                            key={project._id?.toString()}
                            href={{
                              pathname: "/project/[id]",
                              query: { id: project.name?.toString() },
                            }}
                          >
                            <ProjectCard project={project} />
                            {projects?.data?.data.length - 1 == index &&
                              newProject && (
                                <ConfettiExplosion
                                  force={0.4}
                                  duration={2000}
                                  particleCount={100}
                                  width={1920}
                                />
                              )}
                          </Link>
                        )
                      )}
                    {!loading && <AddProjectCard />}
                  </div>
                </Container>
              </div>
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
