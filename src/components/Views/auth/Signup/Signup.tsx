import { FormEvent, useState } from "react";
import Link from "next/link";
import { sendEmailVerification } from "firebase/auth";

import Input from "@/components/Input";
import Button from "@/components/Button";
import View from "@/components/View";
import LoadingOverlay from "@/components/LoadingOverlay";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineLogin, MdOutlineEmail } from "react-icons/md";
import { formatString, Log } from "@/utils";
import { LIMITS } from "@/constants";
import { useAuthStore } from "@/stores/authStore";
import { signup } from "@/utils/signup";
import { signin } from "@/utils/signin";

export function Signup() {
  const authUser = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.authLoading);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    signup?: string;
  }>({
    username: "",
    email: "",
    password: "",
    signup: "",
  });
  const [signupLoading, setSignupLoading] = useState<boolean>(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !username.trim())
      return setErrors({
        email: !email.trim() ? "Email is required" : "",
        password: !password.trim() ? "Password is required" : "",
        username: !username.trim() ? "Username is required" : "",
      });

    if (password !== confirmPassword)
      return setErrors({
        password: "Passwords do not match",
      });

    if (username.length < LIMITS.MIN.USERNAME_CHARACTER_LENGTH)
      return setErrors({
        username: `Username must be at least ${LIMITS.MIN.USERNAME_CHARACTER_LENGTH} characters long`,
      });

    if (password.length < LIMITS.MIN.PASSWORD_CHARACTER_LENGTH)
      return setErrors({
        password: `Password must be at least ${LIMITS.MIN.PASSWORD_CHARACTER_LENGTH} characters long`,
      });

    setErrors({});

    setSignupLoading(true);

    const signupResult = await signup({
      username,
      email,
      password,
    });

    if (
      signupResult?.error?.message === "auth/email-already-in-use" ||
      signupResult?.error?.message === "auth/invalid-email" ||
      signupResult?.error?.message === "auth/email-taken" ||
      signupResult?.error?.message === "auth/weak-password"
    ) {
      setSignupLoading(false);
      return setErrors({
        email:
          signupResult?.error?.message === "auth/email-already-in-use"
            ? "Email is already in use"
            : signupResult?.error?.message === "auth/invalid-email"
            ? "Invalid email"
            : signupResult?.error?.message === "auth/email-taken"
            ? "Email is already in use"
            : "",
        password:
          signupResult?.error?.message === "auth/weak-password"
            ? "Password is too weak"
            : "",
      });
    }

    if (signupResult?.error?.message === "auth/username-taken") {
      setSignupLoading(false);
      return setErrors({
        username: "Username already in use",
      });
    }

    if (signupResult?.error?.message === "auth/too-many-requests") {
      setSignupLoading(false);
      return setErrors({
        signup: "Too many requests. Please try again later",
      });
    }

    Log.debug("Signup!", signupResult);

    if (signupResult?.success) {
      setErrors({});

      const signinResult = await signin({
        email,
        password,
      });

      if (signinResult?.success) {
        setTimeout(async () => {
          await sendEmailVerification(signinResult?.user);
        }, 5000);
      }

      /* giriş yap adama mail at
      const login = await auth?.login.platform("email", { email, password });
      if (login?.authUser) {
        const verify = await sendEmailVerification(login.authUser);
      }
      */
      return;
    }
  }

  if (authUser || authLoading) return <LoadingOverlay />;

  if (signupLoading) {
    return (
      <div className="flex flex-col gap-8 items-center justify-center">
        <LoadingOverlay />
        <h1 className="font-semibold text-xl">Signing up...</h1>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-semibold text-2xl dark:text-dark-text">
        Sign up to Nexys
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <form className="flex flex-col gap-1" onSubmit={onSubmit}>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="font-semibold dark:text-dark-text"
              >
                Username
              </label>
              <Input
                id="username"
                height="h-8"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(formatString(e.target.value).toLocaleLowerCase())
                }
                maxLength={LIMITS.MAX.USERNAME_CHARACTER_LENGTH}
                icon={<AiOutlineUser size={18} />}
                className="pl-[28px]"
              />
              <View.If
                visible={
                  errors?.username != null && errors?.username.length > 0
                }
              >
                <label className="text-red-600 font-semibold text-xs">
                  {errors.username}
                </label>
              </View.If>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="font-semibold dark:text-dark-text"
              >
                E-mail
              </label>
              <Input
                id="email"
                height="h-8"
                type="email"
                placeholder="E-mail"
                value={email}
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
                maxLength={LIMITS.MAX.EMAIL_CHARACTER_LENGTH}
                icon={<MdOutlineEmail size={18} />}
                className="pl-[28px]"
              />
              <View.If
                visible={errors?.email != null && errors?.email.length > 0}
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
                onChange={(e) => setPassword(e.target.value)}
                maxLength={LIMITS.MAX.PASSWORD_CHARACTER_LENGTH}
                icon={<RiLockPasswordLine />}
                className="pl-[28px]"
              />
              {errors.password && (
                <label className="text-red-600 font-semibold text-xs">
                  {errors.password}
                </label>
              )}
            </div>
            <div className="flex flex-col gap-1">
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
            </div>
            <Button
              className="mt-3"
              fullWidth
              type="submit"
              loading={authLoading}
            >
              <MdOutlineLogin />
              <span className="ml-2">Sign up</span>
            </Button>
            {errors.signup && (
              <label className="text-red-600 font-semibold text-xs">
                {errors.signup}
              </label>
            )}
          </form>
          <div className="w-full flex flex-row items-center gap-2">
            <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-dark-border"></div>
            <span className="uppercase text-xs font-semibold text-neutral-500 dark:text-dark-accent">
              {"have an account?"}
            </span>
            <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-dark-border"></div>
          </div>
          <Link href="/auth/signin">
            <Button size="md" fullWidth>
              <IoMdArrowBack />
              <span className="ml-2">Sign in</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
