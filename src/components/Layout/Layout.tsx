import { useEffect } from "react";
import Cookies from "js-cookie";
import { onIdTokenChanged, onAuthStateChanged, getAuth } from "firebase/auth";

import { setValidatedUser, setUser, setLoading } from "@/stores/authStore";
import type { NexysComponentProps } from "@/types";

interface LayoutProps extends NexysComponentProps {
  withoutLayout?: boolean;
}

export default function Layout(props: LayoutProps) {
  const auth = getAuth();

  useEffect(() => {
    if (props.validate && Cookies.get("auth")) {
      if (props.validate.success) setValidatedUser(props.validate.data);
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

  return (
    <main className="mx-auto transition-all overflow-x-hidden ease-in-out duration-300 overflow-auto dark:bg-black/50 bg-white h-full items-center w-full flex flex-col dark:text-white relative text-black">
      {props.children}
    </main>
  );
}
