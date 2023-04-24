import Head from "next/head";

import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import AddProject from "@/components/AddProject";
import { ValidateToken } from "@/utils/api/validateToken";
import WithAuth from "@/hocs/withAuth";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

export default function NewProjectPage(props: NexysComponentProps) {
  return (
    <Layout withoutLayout {...props}>
      <WithAuth {...props}>
        <Head>
          <title>New Project</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar />
        <Container>
          <div className="flex flex-col py-2 pb-8 pt-8 justify-center">
            <h1 className="text-3xl font-semibold">
              {"Let's get you started."}
            </h1>
            <h2 className="text-neutral-400">
              {"Your new project will be flawless with Nexys."}
            </h2>
          </div>
        </Container>
        <Container>
          <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-2">
            <AddProject />
            <div className="dark:shadow-neutral-900 flex flex-col justify-between dark:bg-black bg-white rounded-lg p-4 h-32 border-[1px] border-neutral-200 dark:border-neutral-900">
              .
            </div>
          </div>
        </Container>
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
