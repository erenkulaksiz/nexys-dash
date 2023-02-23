import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Dropdown } from "./components";
import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import Loading from "@/components/Loading";
import LogoWhite from "@/public/images/logo_white.png";
import LogoBlack from "@/public/images/logo_black.png";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";

export default function Navbar({ hideAuth = false }: { hideAuth?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onThemeChange() {
    setTheme(resolvedTheme == "dark" ? "light" : "dark");
  }

  return (
    <nav className="flex items-center justify-between sticky top-0 pl-4 pr-4 py-4 w-full z-50 border-b-[1px] border-neutral-200 dark:border-neutral-900">
      <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-md -z-10"></div>
      <Link href={"/"} title={"Home"}>
        {mounted ? (
          <div className="flex gap-2">
            <Image
              src={resolvedTheme == "dark" ? LogoWhite : LogoBlack}
              alt="Nexys Logo"
              width={90}
            />
            <span className="flex items-center justify-center text-xs text-neutral-400 dark:text-neutral-600">
              ALPHA
            </span>
          </div>
        ) : (
          <div className="w-40 h-10 dark:bg-neutral-800 bg-neutral-200 animate-pulse" />
        )}
      </Link>
      {true && <Dropdown />}
      {false && (
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
                {resolvedTheme == "dark" ? <MdDarkMode /> : <MdLightMode />}
              </Button>
            </Tooltip>
          </div>
          {!hideAuth && (
            <>
              <Link href="/auth/login">
                <Button light className="px-2 hidden sm:flex">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="px-2">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
