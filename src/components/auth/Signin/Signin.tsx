import Link from "next/link";
import { useState } from "react";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";

import Button from "@/components/Button";
import View from "@/components/View";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { MdOutlineLogin } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { Log } from "@/utils";
import { signin, useAuthStore } from "@/stores/authStore";

export function Signin({ onEmailLogin }: { onEmailLogin?: () => void }) {
  const [error, setError] = useState("");
  const authLoading = useAuthStore((state) => state.authLoading);

  function onLoginPlatform(provider: GithubAuthProvider | GoogleAuthProvider) {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user as User;
        signin(user);
        const token = await user.getIdToken();
        Log.debug("User", user);
      })
      .catch((error) => {
        if (error.code === "auth/account-exists-with-different-credential") {
          setError("This account is already registered with another platform.");
        } else if (error.code === "auth/popup-blocked") {
          setError("Please enable popups to continue.");
        } else {
          setError(error.message);
        }
      });
  }

  return (
    <>
      <h1 className="font-semibold text-2xl">Sign in to Nexys</h1>
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-row items-center gap-2">
          <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-neutral-900/50"></div>
          <span className="uppercase text-xs font-semibold text-neutral-500">
            using
          </span>
          <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-neutral-900/50"></div>
        </div>
        <Button
          onClick={() => {
            if (authLoading) return;
            onLoginPlatform(new GoogleAuthProvider());
          }}
          size="md"
          light="bg-blue-600 text-white"
          fullWidth
          loading={authLoading}
        >
          <FaGoogle size={16} />
          <span className="ml-2">Google</span>
        </Button>
        <Button
          onClick={() => {
            if (authLoading) return;
            onLoginPlatform(new GithubAuthProvider());
          }}
          size="md"
          light="bg-neutral-700 text-white"
          fullWidth
          loading={authLoading}
        >
          <FaGithub size={16} />
          <span className="ml-2">GitHub</span>
        </Button>
        <View.If visible={!!error.length}>
          <label className="text-red-600 font-semibold text-xs">{error}</label>
        </View.If>
        <div className="w-full flex flex-row items-center gap-2">
          <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-neutral-900/50"></div>
          <span className="uppercase text-xs font-semibold text-neutral-500">
            or
          </span>
          <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-neutral-900/50"></div>
        </div>
        <Button size="md" fullWidth onClick={onEmailLogin}>
          <HiOutlineMail size={16} />
          <span className="ml-2">E-mail</span>
        </Button>
        <div className="flex flex-col gap-2">
          <div className="w-full flex flex-row items-center gap-2">
            <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-neutral-900/50"></div>
            <span className="uppercase text-xs font-semibold text-neutral-500">
              {"don't have an account?"}
            </span>
            <div className="flex-1 flex h-[2px] rounded bg-neutral-300/30 dark:bg-neutral-900/50"></div>
          </div>
          <Link href="/auth/signup">
            <Button size="md" fullWidth>
              <MdOutlineLogin />
              <span className="ml-2">Sign up</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
