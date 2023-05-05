import Head from "next/head";

import Layout from "@/components/Layout";
import WithoutAuth from "@/hocs/withoutAuth";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { Signup as SignupForm } from "@/components/auth/Signup";

export default function SignupPage() {
  return (
    <Layout withoutLayout>
      <WithoutAuth>
        <Head>
          <title>Nex · Sign up</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className="h-full">
          <Navbar hideAuth />
          <Container className="flex justify-center h-full items-center">
            <div className="p-4 flex flex-col gap-6 w-[300px]">
              <SignupForm />
            </div>
          </Container>
        </main>
      </WithoutAuth>
    </Layout>
  );
}