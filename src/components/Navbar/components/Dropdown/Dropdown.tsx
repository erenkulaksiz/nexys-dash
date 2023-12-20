import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Avatar from "@/components/Avatar";
import Tooltip from "@/components/Tooltip";
import View from "@/components/View";
import Button from "@/components/Button";
import { MdDarkMode, MdLightMode, MdLogout } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { version } from "@/utils";
import { signout } from "@/stores/authStore";
import { useAuthStore } from "@/stores/authStore";
import { nexys } from "@/utils/nexys";
import { RiVipDiamondLine } from "react-icons/ri";

export default function Dropdown() {
  const { resolvedTheme, setTheme } = useTheme();
  const validatedUser = useAuthStore((state) => state.validatedUser);

  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (easterEggClicks >= 10) {
      nexys.log({}, { action: "EASTER_EGG_1" });
      router.push("/naz");
    }
  }, [easterEggClicks]);

  function onThemeChange() {
    setTheme(resolvedTheme == "dark" ? "light" : "dark");
    nexys.log(
      {
        theme: resolvedTheme == "dark" ? "light" : "dark",
      },
      { action: "CHANGE_THEME" }
    );
  }

  return (
    <>
      <details className="relative inline-block bg-transparent list-none">
        <summary
          style={{
            userSelect: "none",
          }}
        >
          <div className="border-[1px] rounded-full p-[2px] border-neutral-400/30 dark:border-neutral-800/50">
            <Avatar
              size="xl"
              src={
                validatedUser?.avatar
                  ? validatedUser?.avatar
                  : "/images/avatar.png"
              }
              className="cursor-pointer"
            />
          </div>
        </summary>
        <div
          className="flex flex-col gap-1 w-36 items-start p-2 absolute top-full rounded-xl right-0 dark:bg-black bg-white border-[1px] border-neutral-200 dark:border-neutral-900 shadow-neutral-200/50 dark:shadow-neutral-900/20"
          style={{ zIndex: 999 }}
        >
          {/*<div className="w-full flex justify-end items-center gap-1">
            <div className="border-[1px] border-neutral-200 dark:border-neutral-900 px-1 py-[2px] pb-1 rounded-lg text-xs first-letter:uppercase items-center justify-center">
              {validatedUser?.subscription?.type}
            </div>
            <Link href="/subscription">
              <Button size="h-6" className="px-1">
                Plans
              </Button>
            </Link>
            </div>*/}

          <div className="flex justify-end w-full">
            <Link href="/feedback">
              <Button
                light="dark:bg-white bg-black dark:text-black"
                className="px-2 text-white"
              >
                <span className="ml-1">Feedback</span>
              </Button>
            </Link>
          </div>
          <div className="text-xs font-semibold w-full flex justify-end">
            {`@${validatedUser?.username}`}
          </div>
          <div className="flex flex-row w-full justify-end gap-1 items-center">
            <span
              className="text-xs text-neutral-400"
              onClick={() => setEasterEggClicks(easterEggClicks + 1)}
              title="Dashboard Version"
            >{`v${version}`}</span>
            <Tooltip content="Nexys Docs" direction="left" outline>
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
              direction="left"
              outline
            >
              <Button
                onClick={onThemeChange}
                className="w-8"
                title="Change Theme"
              >
                <View viewIf={resolvedTheme == "dark"}>
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
          {/*<Button title="plans" fullWidth onClick={() => {}}>
            <RiVipDiamondLine />
            <span className="ml-1">plans</span>
            </Button>*/}
          <Button title="log out" fullWidth onClick={signout}>
            <MdLogout />
            <span className="ml-1">log out</span>
          </Button>
        </div>
      </details>
      <style jsx>{`
        details[open] > summary:before {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 40;
          display: block;
          cursor: default;
          content: " ";
        }
        details > summary {
          list-style: none;
        }
        details > summary::-webkit-details-marker {
          display: none;
        }
        details > summary:first-of-type {
          list-style-type: none;
        }
        details > summary::marker {
          display: none;
        }
      `}</style>
    </>
  );
}
