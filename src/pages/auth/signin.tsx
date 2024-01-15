import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import Container from "@/components/Container";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import View from "@/components/View";
import {
  Signin as SigninForm,
  Email as EmailSignin,
} from "@/components/auth/Signin";
import { RiShareBoxLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import WithoutAuth from "@/hocs/withoutAuth";
import { useAuthStore } from "@/stores/authStore";

export default function SigninPage() {
  const [usingEmail, setUsingEmail] = useState<boolean>(false);
  const authLoading = useAuthStore((state) => state.authLoading);

  return (
    <Layout>
      <WithoutAuth>
        <Head>
          <title>Nex · Sign in</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar hideAuth />
        <Container className="flex justify-center h-full items-center">
          <div className="p-4 flex flex-col gap-6 w-[300px] relative">
            <div className="absolute right-[calc(100%+30px)] bottom-0 top-0 hidden md:hidden sm:hidden lg:flex items-center">
              <div className="flex flex-col p-4">
                <div className="w-[300px] relative h-[200px] dark:bg-neutral-800 bg-neutral-200 rounded-lg overflow-hidden">
                  <img
                    src="/images/landing_bg_banner_1.png"
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 from-black via-black/80 to-transparent bg-gradient-to-t h-full flex flex-col justify-end p-4">
                    <div className="text-2xl font-semibold text-white">
                      {"We're public testing Nexys."}
                    </div>
                    <div className="text-neutral-400">
                      Please use feedback button if you encounter any bugs or
                      have any suggestions. (on top right when you sign in)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <View viewIf={!usingEmail}>
              <View.If>
                <SigninForm onEmailLogin={() => setUsingEmail(true)} />
              </View.If>
              <View.Else>
                <EmailSignin onBack={() => setUsingEmail(false)} />
              </View.Else>
            </View>
            <View.If hidden={authLoading}>
              <div className="flex flex-row gap-2 justify-center items-center">
                <Link
                  href="/privacy-policy"
                  className="flex flex-row gap-1 items-center"
                >
                  <RiShareBoxLine />
                  <div>Privacy Policy</div>
                </Link>
                <div>•</div>
                <Link
                  href="mailto:erenkulaksz@gmail.com"
                  className="flex flex-row gap-1 items-center"
                >
                  <MdOutlineEmail />
                  <div>Contact</div>
                </Link>
              </div>
            </View.If>
          </div>
        </Container>
      </WithoutAuth>
    </Layout>
  );
}
