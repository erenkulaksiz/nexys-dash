import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Avatar from "@/components/Avatar";
import Tooltip from "@/components/Tooltip";
import View from "@/components/View";
import Button from "@/components/Button";
import { MdDarkMode, MdLightMode, MdLogout, MdFeedback } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { version } from "@/utils";
import { signout } from "@/stores/authStore";
import { useAuthStore } from "@/stores/authStore";
import { nexys } from "@/utils/nexys";

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
          <div className="border-[1px] rounded-full p-[2px] border-neutral-400/30 dark:border-dark-border">
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
        <div className="flex flex-col overflow-hidden w-[220px] items-start absolute top-full rounded-xl right-0 dark:bg-dark bg-white border-[1px] border-neutral-200 dark:border-dark-border shadow-neutral-200/50 dark:shadow-neutral-900/20 z-[999]">
          <div className="text-sm font-semibold w-full flex p-4 border-b-[1px] dark:border-b-dark-border dark:text-dark-text">
            <View
              viewIf={
                !!validatedUser?.email && validatedUser?.email?.length > 26
              }
            >
              <View.If>
                {`${validatedUser?.email?.substring(0, 23)}...`}
              </View.If>
              <View.Else>{validatedUser?.email}</View.Else>
            </View>
          </div>
          <div className="flex flex-col w-full border-b-[1px] dark:border-b-dark-border">
            <div className="flex justify-end w-full">
              <Link
                href="https://docs.nexys.app"
                className="w-full"
                target="_blank"
              >
                <Button
                  rounded="not-rounded"
                  className="px-4 py-5 justify-between"
                  fullWidth
                  light="active:scale-1 active:dark:bg-dark hover:dark:bg-darker/50 hover:bg-neutral-100"
                  center={false}
                >
                  <div className="w-full flex flex-row justify-between items-center">
                    <span>Documentation</span>
                    <span>
                      <IoDocumentText />
                    </span>
                  </div>
                </Button>
              </Link>
            </div>
            <div className="flex justify-end w-full">
              <Link href="/feedback" className="w-full">
                <Button
                  rounded="not-rounded"
                  className="px-4 py-5 justify-between"
                  fullWidth
                  light="active:scale-1 active:dark:bg-dark hover:dark:bg-darker/50 hover:bg-neutral-100"
                  center={false}
                >
                  <div className="w-full flex flex-row justify-between items-center">
                    <span>Feedback</span>
                    <span>
                      <MdFeedback />
                    </span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <Button
              onClick={onThemeChange}
              rounded="not-rounded"
              className="px-4 py-5"
              fullWidth
              light="active:scale-1 active:dark:bg-dark hover:dark:bg-darker/50 hover:bg-neutral-100"
              center={false}
            >
              <div className="w-full flex justify-between items-center flex-row">
                <span>Theme</span>
                <span>
                  <View viewIf={resolvedTheme == "dark"}>
                    <View.If>
                      <MdDarkMode />
                    </View.If>
                    <View.Else>
                      <MdLightMode />
                    </View.Else>
                  </View>
                </span>
              </div>
            </Button>
            <div className="z-10 overflow-hidden flex flex-row items-center relative transition-all duration-75 font-semibold text-sm px-4 py-5 justify-between w-full rounded-none h-8">
              <span>Version</span>
              <span
                className="text-xs text-neutral-400"
                onClick={() => setEasterEggClicks(easterEggClicks + 1)}
                title="Dashboard Version"
              >{`v${version}`}</span>
            </div>
          </div>
          <Button
            onClick={signout}
            rounded="not-rounded"
            className="px-4 py-5"
            fullWidth
            light="active:scale-1 active:dark:bg-dark hover:dark:bg-darker/50 hover:bg-neutral-100"
            center={false}
          >
            <div className="w-full flex justify-between items-center flex-row">
              <span>Sign out</span>
              <span>
                <MdLogout />
              </span>
            </div>
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
