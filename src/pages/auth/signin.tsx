import Head from "next/head";
import { useState } from "react";

import Container from "@/components/Container";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import { Signin as SigninForm } from "@/components/auth/Signin";
import { Email as EmailSignin } from "@/components/auth/Signin";
import type { NexysComponentProps } from "@/types";

export default function Signin(props: NexysComponentProps) {
  const [usingEmail, setUsingEmail] = useState<boolean>(false);

  return (
    <Layout withoutLayout>
      <Head>
        <title>Sign in</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="h-full">
        <Navbar hideAuth />
        <Container className="flex justify-center h-full items-center">
          <div className="p-4 flex flex-col gap-6 w-[300px]">
            {!usingEmail && (
              <SigninForm onEmailLogin={() => setUsingEmail(true)} />
            )}
            {usingEmail && <EmailSignin onBack={() => setUsingEmail(false)} />}
          </div>
        </Container>
      </main>
    </Layout>
  );
}
