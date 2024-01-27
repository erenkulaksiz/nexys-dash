import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { onIdTokenChanged, onAuthStateChanged, getAuth } from "firebase/auth";

import {
  setValidatedUser,
  setUser,
  setLoading,
  refreshToken,
} from "@/stores/authStore";
import { BuildComponent } from "@/utils/style";
import type { NexysComponentProps } from "@/types";

interface LayoutProps extends NexysComponentProps {
  withoutLayout?: boolean;
  className?: string;
}

export default function Layout(props: LayoutProps) {
  const auth = getAuth();
  const router = useRouter();

  const BuildLayout = BuildComponent({
    name: "Layout",
    defaultClasses:
      "mx-auto transition-colors ease-in-out duration-400 overflow-x-hidden overflow-auto dark:bg-black/50 bg-white h-full items-center w-full flex flex-col dark:text-white relative text-black",
    extraClasses: props?.className,
  });

  useEffect(() => {
    if (props.validate && Cookies.get("auth")) {
      if (props.validate.success) setValidatedUser(props.validate.data);

      if (props.validate.success == false) {
        if (
          props.validate.error === "auth/id-token-expired" ||
          props.validate.error === "auth/no-auth"
        ) {
          (async () => {
            await refreshToken(true);
            router.replace(router.asPath);
          })();
        }
      }
    }
  }, [props.validate]);

  useEffect(() => {
    const tokenChange = onIdTokenChanged(auth, async (user) => {
      setLoading(true);
      if (!user) {
        setUser(null);
        Cookies.remove("auth");
        setLoading(false);
        return;
      } else {
        const token = await user.getIdToken();
        setUser(user);
        Cookies.set("auth", token, { expires: 365 });
        setLoading(false);
      }
    });

    const tokenCheck = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (!user) {
        setUser(null);
        Cookies.remove("auth");
        setLoading(false);
      } else {
        const token = await user.getIdToken();
        Cookies.set("auth", token, { expires: 365 });
        setUser(user ?? null);
        setLoading(false);
      }
    });

    return () => {
      tokenChange();
      tokenCheck();
    };
  }, []);

  if (props.withoutLayout) return <>{props.children}</>;

  return <main className={BuildLayout.classes}>{props.children}</main>;
}
