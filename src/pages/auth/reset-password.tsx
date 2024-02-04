import Head from "next/head";
import { FormEvent, useState, useEffect } from "react";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";

import { MdCheckCircleOutline } from "react-icons/md";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import WithoutAuth from "@/hocs/withoutAuth";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import View from "@/components/View";
import { LIMITS } from "@/constants";
import { useAuthStore } from "@/stores/authStore";
import { RiLockPasswordLine } from "react-icons/ri";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

export default function ResetPasswordPage(props: NexysComponentProps) {
  const authLoading = useAuthStore((state) => state.authLoading);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isReset, setIsReset] = useState<boolean>(false);

  const [isAlreadyReset, setIsAlreadyReset] = useState<boolean>(false);

  useEffect(() => {
    if (props?.validate?.success === false) {
      setIsAlreadyReset(true);
    }
  }, [props.validate]);

  async function resetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < LIMITS.MIN.PASSWORD_CHARACTER_LENGTH) {
      setError(
        `Password must be at least ${LIMITS.MIN.PASSWORD_CHARACTER_LENGTH} characters long.`
      );
      return;
    }

    setLoading(true);
    const actionCode = props?.validate?.key || "";
    try {
      await confirmPasswordReset(getAuth(), actionCode, password);
      setIsReset(true);
    } catch (error: any) {
      if (
        error.code === "auth/expired-action-code" ||
        error.code === "auth/invalid-action-code" ||
        error.code === "auth/invalid-action-code"
      ) {
        setIsAlreadyReset(true);
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak, please try another password.");
      } else {
        setError("An error occurred, please try again.");
      }
    }
    setLoading(false);
  }

  return (
    <Layout>
      <WithoutAuth>
        <Head>
          <title>Nex · Reset Password</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar hideAuth />
        <Container className="flex justify-center h-full items-center">
          <div className="p-4 flex flex-col gap-2 w-[300px]">
            <h1 className="font-semibold text-2xl">Reset Password</h1>
            <View viewIf={isAlreadyReset}>
              <View.If>
                <div className="flex flex-row gap-2">
                  <div>
                    It seems like you have already reset your password or this
                    link is invalid.
                  </div>
                </div>
              </View.If>
              <View.Else>
                <View viewIf={isReset}>
                  <View.If>
                    <div className="flex flex-row gap-2">
                      <MdCheckCircleOutline
                        size={48}
                        className="text-green-500"
                      />
                      <div>
                        We have changed your password, you may login with your
                        new password.
                      </div>
                    </div>
                  </View.If>
                  <View.Else>
                    <form
                      className="flex flex-col gap-1"
                      onSubmit={resetPassword}
                    >
                      <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-semibold">
                          Password
                        </label>
                        <Input
                          id="password"
                          type="password"
                          height="h-8"
                          placeholder="Password"
                          password
                          passwordVisibility
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          maxLength={LIMITS.MAX.PASSWORD_CHARACTER_LENGTH}
                          icon={<RiLockPasswordLine />}
                          className="pl-[28px]"
                        />
                        <label
                          htmlFor="confirm"
                          className="font-semibold dark:text-dark-text"
                        >
                          Confirm Password
                        </label>
                        <Input
                          id="confirm"
                          type="password"
                          height="h-8"
                          placeholder="Password"
                          password
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          maxLength={LIMITS.MAX.PASSWORD_CHARACTER_LENGTH}
                          icon={<RiLockPasswordLine />}
                          className="pl-[28px]"
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
              </View.Else>
            </View>
          </div>
        </Container>
      </WithoutAuth>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  if (ctx.req) {
    const query = ctx.query;

    if (!query || !query?.key) {
      ctx.res.writeHead(302, {
        Location: `/auth/signin`,
      });
      ctx.res.end();

      validate = { success: false };
    } else {
      const auth = getAuth();
      const actionCode = query.key as string;

      try {
        const email = await verifyPasswordResetCode(auth, actionCode);
        validate = { success: true, email, key: actionCode };
      } catch (error) {
        validate = { success: false };
      }
    }
  }
  return { props: { validate } };
}
