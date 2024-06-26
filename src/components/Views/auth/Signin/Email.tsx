import { useState } from "react";
import Link from "next/link";

import Button from "@/components/Button";
import Input from "@/components/Input";
import LoadingOverlay from "@/components/LoadingOverlay";
import { IoMdArrowBack } from "react-icons/io";
import { MdOutlineLogin, MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { LIMITS } from "@/constants";
import { signin } from "@/utils/signin";
import View from "@/components/View";
import { useAuthStore } from "@/stores/authStore";
import { Log } from "@/utils";
import type { FormEvent } from "react";

export function Email({ onBack }: { onBack?: () => void }) {
  const authUser = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.authLoading);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    login?: string;
  }>({
    email: "",
    password: "",
    login: "",
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim())
      return setErrors({
        email: !email.trim() ? "Email is required" : "",
        password: !password.trim() ? "Password is required" : "",
      });

    const signinResult = await signin({ email, password });

    if (!signinResult?.success) {
      if (
        signinResult.error.errorCode == "auth/user-not-found" ||
        signinResult.error.errorCode == "auth/wrong-password"
      ) {
        setErrors({ login: "Incorrect email or password" });
      }
      if (signinResult.error.errorCode == "auth/too-many-requests") {
        setErrors({ login: "Too many requests, try again later" });
      }
      if (signinResult.error.errorCode == "auth/user-disabled") {
        setErrors({ login: "This account has been disabled" });
      }
      if (signinResult.error.errorCode == "auth/network-request-failed") {
        setErrors({
          login:
            "Error with communicating auth service, please check your internet connection",
        });
      }
      Log.debug(signinResult.error);
      return;
    }

    setErrors({});
  }

  if (authUser || authLoading) return <LoadingOverlay />;

  return (
    <>
      <h1 className="font-semibold text-2xl dark:text-dark-text">
        Sign in to Nexys
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-4">
          <button
            onClick={onBack}
            className="w-full flex flex-row items-center gap-1 text-xs font-semibold text-neutral-500 dark:text-dark-accent"
          >
            <IoMdArrowBack
              size={18}
              className="fill-neutral-300 dark:fill-dark-border"
            />
            <span className="uppercase">back</span>
            <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-dark-border"></div>
          </button>
          <form className="flex flex-col gap-1" onSubmit={onSubmit}>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="font-semibold dark:text-dark-text"
              >
                E-mail
              </label>
              <Input
                required
                id="email"
                height="h-8"
                type="email"
                placeholder="E-mail"
                value={email}
                className="pl-[28px]"
                onChange={(e) => setEmail(e.target.value)}
                icon={<MdOutlineEmail size={18} />}
                maxLength={LIMITS.MAX.EMAIL_CHARACTER_LENGTH}
              />
              <View.If
                visible={errors?.email != null && errors?.email?.length > 0}
              >
                <label className="text-red-600 font-semibold text-xs">
                  {errors.email}
                </label>
              </View.If>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="font-semibold dark:text-dark-text"
              >
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
                className="pl-[28px]"
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<RiLockPasswordLine size={18} />}
                maxLength={LIMITS.MAX.PASSWORD_CHARACTER_LENGTH}
              />
              <View.If
                visible={
                  errors?.password != null && errors?.password?.length > 0
                }
              >
                <label className="text-red-600 font-semibold text-xs">
                  {errors.password}
                </label>
              </View.If>
            </div>
            <Button
              className="mt-4"
              fullWidth
              type="submit"
              loading={authLoading}
            >
              <MdOutlineLogin />
              <span className="ml-2">Sign in</span>
            </Button>
            <View.If visible={!!errors.login?.length}>
              <label className="text-red-600 font-semibold text-xs">
                {errors.login}
              </label>
            </View.If>
            <div className="flex flex-row items-center justify-center gap-2 w-full mt-1">
              <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-dark-border"></div>
              <Link href="/auth/forgot-password">
                <div className="flex items-center justify-center text-xs font-semibold text-neutral-500 dark:text-dark-accent uppercase">
                  forgot password?
                </div>
              </Link>
              <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-dark-border"></div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
