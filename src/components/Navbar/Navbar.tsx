import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

import Dropdown from "./components/Dropdown";
import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import Loading from "@/components/Loading";
import Container from "@/components/Container";
import View from "@/components/View";
import LogoWhite from "@/public/images/logo_white.png";
import LogoBlack from "@/public/images/logo_black.png";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { useAuthStore } from "@/stores/authStore";

export default function Navbar({ hideAuth = false }: { hideAuth?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const authLoading = useAuthStore((state) => state.authLoading);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onThemeChange() {
    setTheme(resolvedTheme == "dark" ? "light" : "dark");
  }

  return (
    <nav className="sticky top-0 py-4 w-full z-50 border-b-[1px] border-neutral-200 dark:border-dark-border transition-colors ease-in-out duration-400">
      <Container className="flex justify-between">
        <div className="absolute left-0 right-0 top-0 bottom-0 bg-white/50 dark:bg-darker backdrop-blur-md -z-10 transition-colors ease-in-out duration-400"></div>
        <Link
          href={authUser ? "/" : "/auth/signin"}
          title={authUser ? "Home" : "Sign in"}
        >
          <View viewIf={mounted}>
            <View.If>
              <div className="flex gap-2 items-center">
                <Image
                  src={resolvedTheme == "dark" ? LogoWhite : LogoBlack}
                  alt="Nexys Logo"
                  width={90}
                  priority
                  placeholder="blur"
                  quality={100}
                  blurDataURL={
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  }
                  style={{ imageRendering: "crisp-edges" }}
                />
                <span className="flex px-[6px] rounded-lg items-center justify-center text-xs text-neutral-400 dark:text-dark-accent dark:bg-dark bg-neutral-100 transition-colors ease-in-out duration-400">
                  WIP
                </span>
              </div>
            </View.If>
            <View.Else>
              <div className="w-40 h-10 dark:bg-neutral-800 bg-neutral-200 animate-pulse" />
            </View.Else>
          </View>
        </Link>
        <View.If visible={authLoading}>
          <Loading size="lg" />
        </View.If>
        <View.If visible={!authLoading && !hideAuth && !!authUser}>
          <Dropdown />
        </View.If>
        <View.If visible={!authLoading && !authUser}>
          <div className="flex flex-row gap-1">
            <div className="flex flex-row gap-1">
              <Tooltip content="Nexys Docs" direction="bottom" outline>
                <Link href="https://docs.nexys.app" target="_blank">
                  <Button className="w-8" title="Nexys Docs">
                    <IoDocumentText />
                  </Button>
                </Link>
              </Tooltip>
              <Tooltip
                content={`${
                  resolvedTheme == "dark" ? "Light Theme" : "Dark Theme"
                }`}
                direction="bottom"
                outline
              >
                <Button
                  onClick={onThemeChange}
                  className="w-8"
                  title="Change Theme"
                >
                  <View viewIf={resolvedTheme === "dark"}>
                    <View.If>
                      <MdDarkMode />
                    </View.If>
                    <View.Else>
                      <MdLightMode />
                    </View.Else>
                  </View>
                </Button>
              </Tooltip>
            </div>
            <View.If hidden={hideAuth}>
              <Link href="/auth/signin">
                <Button light className="px-2">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="px-2">Sign Up</Button>
              </Link>
            </View.If>
          </div>
        </View.If>
      </Container>
    </nav>
  );
}
