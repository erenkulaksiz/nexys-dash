import Head from "next/head";
import CountUp from "react-countup";

import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import AddProject from "@/components/AddProject";
import { ValidateToken } from "@/utils/api/validateToken";
import WithAuth from "@/hocs/withAuth";
import getTotalErrors from "@/utils/api/getTotalErrors";
import { MdError } from "react-icons/md";
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
          <div className="w-full grid sm:grid-cols-2 grid-cols-1 items-start gap-2">
            <AddProject />
            <div className="dark:shadow-neutral-900 flex flex-col justify-between dark:bg-black bg-white rounded-lg p-4 border-[1px] border-neutral-200 dark:border-neutral-900">
              <div>total of</div>
              <div className="flex flex-row gap-1 items-end">
                <div className="flex flex-row text-4xl items-end font-semibold dark:text-red-800 text-red-600">
                  <MdError size={18} />
                  <CountUp end={props?.totalErrors ?? 0} duration={0.8} />
                </div>
                <div>errors caught</div>
              </div>
              {/*<div className="flex flex-row gap-1 items-end">
                <div className="text-4xl font-semibold text-neutral-600 dark:text-neutral-500">
                  <CountUp end={44768} duration={0.8} />
                </div>
                <div>logs processed</div>
              </div>*/}
            </div>
          </div>
        </Container>
      </WithAuth>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  let totalErrors: number = 0;
  if (ctx.req) {
    validate = await ValidateToken({ token: ctx.req.cookies.auth });
    totalErrors = await getTotalErrors();
    if (validate.success) {
      if (!validate.data.emailVerified) {
        ctx.res.writeHead(302, { Location: "/auth/verify" });
        ctx.res.end();
        return { props: { validate, totalErrors } };
      }
      return { props: { validate, totalErrors } };
    }
  }
  return { props: { validate, totalErrors } };
}
