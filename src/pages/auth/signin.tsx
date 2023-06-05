import Head from "next/head";
import { useState } from "react";

import Container from "@/components/Container";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import View from "@/components/View";
import {
  Signin as SigninForm,
  Email as EmailSignin,
} from "@/components/auth/Signin";
import WithoutAuth from "@/hocs/withoutAuth";

export default function SigninPage() {
  const [usingEmail, setUsingEmail] = useState<boolean>(false);

  return (
    <Layout withoutLayout>
      <WithoutAuth>
        <Head>
          <title>Nex · Sign in</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className="h-full">
          <Navbar hideAuth />
          <Container className="flex justify-center h-full items-center">
            <div className="p-4 flex flex-col gap-6 w-[300px]">
              <View viewIf={!usingEmail}>
                <View.If>
                  <SigninForm onEmailLogin={() => setUsingEmail(true)} />
                </View.If>
                <View.Else>
                  <EmailSignin onBack={() => setUsingEmail(false)} />
                </View.Else>
              </View>
            </div>
          </Container>
        </main>
      </WithoutAuth>
    </Layout>
  );
}
