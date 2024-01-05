import Head from "next/head";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

import Layout from "@/components/Layout";
import Button from "@/components/Button";
import WithAuth from "@/hocs/withAuth";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Input from "@/components/Input";
import { BsCheckCircleFill } from "react-icons/bs";
import { server } from "@/utils";
import { RiSendPlaneFill } from "react-icons/ri";
import { ValidateToken } from "@/utils/api/validateToken";
import View from "@/components/View";
import type { GetServerSidePropsContext } from "next";
import type { NexysComponentProps } from "@/types";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { FormEvent } from "react";

export default function FeedbackPage(props: NexysComponentProps) {
  const [sentFeedback, setSentFeedback] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function sendFeedback(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!feedback) return setError("Feedback cannot be empty.");
    if (feedback.length > 1000)
      return setError("Feedback cannot be longer than 1000 characters.");
    if (feedback.length < 10)
      return setError("Feedback cannot be shorter than 10 characters.");
    setError("");

    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
    const uid = auth.currentUser?.uid ?? props?.validate?.data?.uid;

    const res = await fetch(`${server}/v1/dash/feedback`, {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      }),
      body: JSON.stringify({ uid, message: feedback }),
    })
      .then(async (res) => {
        if (res.ok) {
          return { success: true };
        }
        const json = await res.json();
        throw new Error(JSON.stringify(json));
      })
      .catch((error: Error) => {
        return { success: false, error: error.message };
      });

    if (res.success) {
      setSentFeedback(true);
    }
  }

  return (
    <Layout {...props}>
      <WithAuth {...props}>
        <Head>
          <title>Nex · Feedback</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <Container>
          <div className="flex flex-col py-2 sm:py-8 justify-center">
            <h1 className="text-2xl sm:text-4xl font-semibold">{"Feedback"}</h1>
            <h2 className="dark:text-neutral-400 text-neutral-500">
              {
                "Every feedback is important to us. Please describe how was your experience, did you encounter any bugs etc. You will receive a response within 24 hours."
              }
            </h2>
          </div>
        </Container>
        <View viewIf={sentFeedback}>
          <View.If>
            <Container>
              <div className="flex flex-row gap-2 items-center">
                <BsCheckCircleFill className="text-4xl text-green-500" />
                <div className="flex flex-col">
                  <h2 className="text-2xl">We recieved your feedback.</h2>
                  <span className="dark:text-neutral-400 text-neutral-500">
                    Thanks for your valuable feedback.
                  </span>
                </div>
              </div>
            </Container>
          </View.If>
          <View.Else>
            <Container>
              <form onSubmit={sendFeedback}>
                <Input
                  placeholder="Your feedback."
                  textarea
                  className="p-2"
                  height="h-64"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                {error && (
                  <div className="text-sm text-red-600 mt-1">{error}</div>
                )}
                <div className="flex flex-row justify-between mt-2">
                  <span className="text-sm dark:text-neutral-400 text-neutral-500">
                    We will make a response to email{" "}
                    {props.validate?.data.email}
                  </span>
                  <div className="flex flex-row gap-2 items-center">
                    <div className="flex flex-row text-sm dark:text-neutral-400 text-neutral-500">
                      <div
                        className={feedback.length > 1000 ? "text-red-600" : ""}
                      >
                        {feedback.length}
                      </div>
                      <div>/1000</div>
                    </div>
                    <Button
                      light="dark:bg-white bg-black dark:text-black"
                      className="px-2 text-white"
                      type="submit"
                    >
                      <RiSendPlaneFill />
                      <span className="ml-1">Send</span>
                    </Button>
                  </div>
                </div>
              </form>
            </Container>
          </View.Else>
        </View>
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
