import Head from "next/head";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/router";

import Container from "@/components/Container";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import View from "@/components/View";
import Navbar from "@/components/Navbar";
import WithAuth from "@/hocs/withAuth";
import { MdLogout, MdRefresh } from "react-icons/md";
import { ValidateToken } from "@/utils/api/validateToken";
import { Log } from "@/utils";
import { useAuthStore, refreshToken, signout } from "@/stores/authStore";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

export default function VerifyPage(props: NexysComponentProps) {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);

  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = await refreshToken(true);

      if (authUser?.emailVerified) {
        Log.debug("Email is verified!");
        router.replace(router.asPath);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  async function onSendAgain() {
    if (sending) return;
    setSending(true);
    if (!authUser) return;
    const send = await sendEmailVerification(authUser).catch((err) => {
      setSending(false);
      return err;
    });
    if (send?.code == "auth/too-many-requests") {
      setError("Too many requests. Please try again later.");
      setSending(false);
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <Layout {...props}>
      <WithAuth {...props}>
        <Head>
          <title>Nex · Verify</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar hideAuth />
        <Container className="flex justify-center h-full items-center">
          <div className="flex flex-col h-full items-start justify-center w-[400px] gap-2">
            <h1 className="text-2xl font-bold">Email Verification</h1>
            <p className="text-neutral-500 text-sm">
              {"We've sent an email to "}
              <span className="text-neutral-400 font-bold">
                {authUser?.email}
              </span>
              {
                " with a link to verify your email address. If you don't see it, check your spam folder."
              }
            </p>
            <p className="text-neutral-500 text-sm">
              After clicking the link we sent you, just refresh this page.
            </p>
            <div className="flex flex-row gap-2">
              <View.If hidden={sent}>
                <Button
                  className="px-2"
                  onClick={onSendAgain}
                  loading={sending}
                >
                  <MdRefresh />
                  <span className="ml-1">Send again</span>
                </Button>
              </View.If>
              <Button className="px-2" onClick={signout}>
                <MdLogout />
                <span className="ml-1">Sign out</span>
              </Button>
            </div>
            <View.If visible={sent}>
              <p className="text-neutral-500 text-sm">
                {"We've sent another verification link to "}
                <span className="text-neutral-400 font-bold">
                  {authUser?.email}
                </span>
              </p>
            </View.If>
            <View.If visible={!!error}>
              <p className="text-neutral-500 text-sm">{error}</p>
            </View.If>
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
    if (validate.success && validate.data.emailVerified === true) {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
      return { props: { validate } };
    } else if (!validate.success) {
      ctx.res.writeHead(302, { Location: "/auth/signin" });
      ctx.res.end();
      return { props: { validate } };
    } else if (validate.success && !validate.data.emailVerified) {
      return { props: { validate } };
    }
  }
  return { props: { validate } };
}
