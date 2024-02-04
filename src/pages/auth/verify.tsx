import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { getAuth, sendEmailVerification, applyActionCode } from "firebase/auth";

import Container from "@/components/Container";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import View from "@/components/View";
import Navbar from "@/components/Navbar";
import WithAuth from "@/hocs/withAuth";
import { MdLogout, MdRefresh, MdHome } from "react-icons/md";
import { ValidateToken } from "@/utils/api/validateToken";
import { useAuthStore, signout } from "@/stores/authStore";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

export default function VerifyPage(props: NexysComponentProps) {
  const authUser = useAuthStore((state) => state.user);

  console.log("authuseer", authUser);

  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  console.log("proppps", props);

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
            <View
              viewIf={
                props.validate?.reset || props.validate?.data?.emailVerified
              }
            >
              <View.If>
                <p className="text-neutral-500 dark:text-dark-accent text-sm">
                  Your email has been verified.
                </p>
                <Link href="/">
                  <Button className="px-4" size="h-10">
                    <MdHome size={24} />
                    <span className="ml-1">Home</span>
                  </Button>
                </Link>
              </View.If>
              <View.Else>
                <p className="text-neutral-500 dark:text-dark-accent text-sm">
                  {"We've sent an email to "}
                  <span className="text-neutral-400 font-bold">
                    {authUser?.email}
                  </span>
                  {
                    " with a link to verify your email address. If you don't see it, check your spam folder."
                  }
                </p>
                <p className="text-neutral-500 dark:text-dark-accent text-sm">
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
                  <Button
                    className="px-2 opacity-0 hover:opacity-0"
                    onClick={signout}
                  >
                    <MdLogout />
                    <span className="ml-1">Sign out</span>
                  </Button>
                </div>
                <View.If visible={sent}>
                  <p className="text-neutral-500 dark:text-dark-accent text-sm">
                    {"We've sent another verification link to "}
                    <span className="text-neutral-400 font-bold">
                      {authUser?.email}
                    </span>
                  </p>
                </View.If>
                <View.If visible={!!error}>
                  <p className="text-neutral-500 text-sm dark:text-dark-accent">
                    {error}
                  </p>
                </View.If>
              </View.Else>
            </View>
          </div>
        </Container>
      </WithAuth>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  if (ctx.req) {
    const query = ctx.query;

    if (query && query.key) {
      const auth = getAuth();
      const actionCode = query.key as string;

      try {
        await applyActionCode(auth, actionCode);

        console.log("user has been verified");

        validate = { success: true, reset: true };
      } catch (error) {
        console.log("error verifying email");
      }
    }

    validate = await ValidateToken({ token: ctx.req.cookies.auth });
    if (validate.success && validate.data.emailVerified === true) {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
      return { props: { validate } };
    } else if (!validate.success) {
      if (validate.error != "auth/email-not-verified") {
        ctx.res.writeHead(302, { Location: "/auth/signin" });
        ctx.res.end();
        return { props: { validate } };
      }
      return { props: { validate } };
    } else if (validate.success && !validate.data.emailVerified) {
      return { props: { validate } };
    }
  }
  return { props: { validate } };
}
