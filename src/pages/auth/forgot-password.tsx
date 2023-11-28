import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import { MdCheckCircleOutline, MdOutlineEmail } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import WithoutAuth from "@/hocs/withoutAuth";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import View from "@/components/View";
import { LIMITS } from "@/constants";
import { Log } from "@/utils";
import { useAuthStore } from "@/stores/authStore";

export default function ForgotPasswordPage() {
  const authLoading = useAuthStore((state) => state.authLoading);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;

    const auth = getAuth();

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(err.message);
      Log.error("sendPasswordResetEmail error", err.message);
      if (err.code === "auth/user-not-found") setError("User not found");
      else if (err.code === "auth/invalid-email") setError("Invalid email");
      else setError("Something went wrong");
    } finally {
      setLoading(false);
      setEmail("");
      setSent(true);
    }
  }

  return (
    <Layout>
      <WithoutAuth>
        <Head>
          <title>Nex · Forgot Password</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar hideAuth />
        <Container className="flex justify-center h-full items-center">
          <div className="p-4 flex flex-col gap-2 w-[300px]">
            <h1 className="font-semibold text-2xl">Forgot Password</h1>
            <View viewIf={sent}>
              <View.If>
                <div className="flex flex-col">
                  <MdCheckCircleOutline size={48} className="text-green-500" />
                  <div>We have sent you an email to reset your password.</div>
                </div>
              </View.If>
              <View.Else>
                <form className="flex flex-col gap-1" onSubmit={onSubmit}>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="font-semibold">
                      E-mail
                    </label>
                    <Input
                      required
                      id="email"
                      height="h-8"
                      type="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<MdOutlineEmail size={18} />}
                      maxLength={LIMITS.MAX.EMAIL_CHARACTER_LENGTH}
                    />
                    <Button
                      fullWidth
                      type="submit"
                      className="mt-2"
                      loading={authLoading || loading}
                    >
                      Reset Password
                    </Button>
                    {error && (
                      <label className="text-red-600 font-semibold text-xs">
                        {error}
                      </label>
                    )}
                  </div>
                </form>
              </View.Else>
            </View>
            <div className="flex flex-col gap-2">
              <div className="w-full flex flex-row items-center gap-2">
                <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-neutral-900/50"></div>
                <span className="uppercase text-xs font-semibold text-neutral-500">
                  {"have an account?"}
                </span>
                <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-neutral-900/50"></div>
              </div>
              <Link href="/auth/signin">
                <Button size="md" fullWidth>
                  <IoMdArrowBack />
                  <span className="ml-2">Sign in</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </WithoutAuth>
    </Layout>
  );
}
