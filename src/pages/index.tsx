import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import ConfettiExplosion from "react-confetti-explosion";

import { Log, server } from "@/utils";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import AddProjectCard from "@/components/home/AddProjectCard";
import ProjectCard from "@/components/home/ProjectCard";
import { useAuthStore, refreshToken } from "@/stores/authStore";
import { ValidateToken } from "@/utils/api/validateToken";
import { RiDashboardFill } from "react-icons/ri";
import WithAuth from "@/hocs/withAuth";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps, ProjectTypes } from "@/types";
import type { GetServerSidePropsContext } from "next";

export default function HomePage(props: NexysComponentProps) {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const newProject = router.query.newProject == "true" ? true : false;

  const uid = props?.validate?.data?.uid || authUser?.uid;

  const _projects = useSWR(["api/dash/projects"], async () => {
    const token = Cookies.get("auth");
    return fetch(`${server}/api/dash/projects`, {
      headers: new Headers({
        "content-type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      }),
      method: "POST",
      body: JSON.stringify({ uid }),
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
    if (_projects?.data?.success == false) {
      Log.error("Loading of projects failed", _projects?.data?.error);
      if (
        _projects?.data?.error == "auth/id-token-expired" ||
        _projects?.data?.error == "auth-uid-error"
      ) {
        (async () => {
          await refreshToken(true);
          await _projects.mutate();
          router.reload();
        })();
      }
      return;
    } else {
      setLoading(false);
    }
  }, [_projects.data]);

  useEffect(() => {
    if (_projects.isValidating) {
      setLoading(true);
    } else {
      if (_projects?.data?.success == false) return;
      setLoading(false);
    }
  }, [_projects.isValidating]);

  return (
    <Layout {...props} withoutLayout>
      <WithAuth {...props}>
        <Head>
          <title>Nexys Dashboard</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
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
            <div className="flex w-full dark:bg-neutral-900a bg-neutral-100/50a">
              <Container>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-2 flex-row items-start">
                  {!loading &&
                    Array.isArray(_projects?.data?.data) &&
                    _projects?.data?.data.length != 0 &&
                    _projects?.data?.data.map(
                      (project: ProjectTypes, index) => (
                        <Link
                          key={project._id?.toString()}
                          href={{
                            pathname: "/project/[id]",
                            query: { id: project.name?.toString() },
                          }}
                        >
                          <ProjectCard project={project} />
                          {_projects?.data?.data.length - 1 == index &&
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
