import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { Log, server } from "@/utils";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { ProjectCard } from "@/components/home/ProjectCard";
import { useAuthStore, refreshToken } from "@/stores/authStore";
import { ValidateToken } from "@/utils/api/validateToken";
import Container from "@/components/Container";
import { MdAdd, MdSpaceDashboard, MdOutlineWarning } from "react-icons/md";
import { WithAuth } from "@/hocs";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps, ProjectTypes } from "@/types";
import type { GetServerSidePropsContext } from "next";

export default function Home(props: NexysComponentProps) {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const validatedUser = useAuthStore((state) => state.validatedUser);

  const [loading, setLoading] = useState(true);

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
      Log.error(_projects?.data?.error);
      if (_projects?.data?.error == "auth/id-token-expired") {
        (async () => {
          await refreshToken(true);
          router.reload();
        })();
      }
      return;
    }
    if (_projects?.data) {
      setLoading(false);
    }
  }, [_projects.data]);

  return (
    <Layout {...props} withoutLayout>
      <WithAuth {...props}>
        <Head>
          <title>Nexys Dashboard</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <Container>
          <div className="flex flex-row py-4 pb-4 items-center h-full gap-2">
            <MdSpaceDashboard size={18} />
            <h1 className="text-xl font-semibold">Projects</h1>
            <Link href="/new">
              <Button className="px-2">
                <MdAdd size={18} />
                <span className="ml-1">New Project</span>
              </Button>
            </Link>
          </div>
        </Container>
        <div className="flex w-full dark:bg-neutral-900a bg-neutral-100/50a">
          {loading && (
            <div className="flex w-full justify-center">
              <Loading size="xl" />
            </div>
          )}
          {!loading &&
            Array.isArray(_projects?.data?.data) &&
            _projects?.data?.data.length != 0 && (
              <Container>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-2 flex-row items-start">
                  {_projects?.data?.data.map((project: ProjectTypes) => (
                    <Link
                      key={project._id?.toString()}
                      href={{
                        pathname: "/project/[id]",
                        query: { id: project._id?.toString() },
                      }}
                    >
                      <ProjectCard project={project} />
                    </Link>
                  ))}
                </div>
              </Container>
            )}
          {!loading &&
            Array.isArray(_projects?.data?.data) &&
            _projects?.data?.data?.length == 0 && (
              <Container className="w-full flex justify-center">
                <div>You do not have any projects.</div>
              </Container>
            )}
        </div>
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
