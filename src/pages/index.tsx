import Head from "next/head";
import { GetServerSidePropsContext } from "next";

import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import { useAuthStore } from "@/stores/authStore";
import { ValidateToken } from "@/utils/api/validateToken";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

export default function Home(props: NexysComponentProps) {
  const authUser = useAuthStore((state) => state.user);

  console.log("props", props);

  return (
    <>
      <Head>
        <title>Nexys Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Layout {...props} withoutLayout>
        <div>user: {JSON.stringify(authUser)}</div>
      </Layout>
    </>
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
