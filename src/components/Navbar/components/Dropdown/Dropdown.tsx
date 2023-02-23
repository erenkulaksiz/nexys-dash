import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

import Avatar from "@/components/Avatar";
import Tooltip from "@/components/Tooltip";
import Button from "@/components/Button";
import { MdDarkMode, MdLightMode, MdLogout } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { version } from "@/utils";

export function Dropdown() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  function onThemeChange() {
    setTheme(resolvedTheme == "dark" ? "light" : "dark");
  }

  return (
    <>
      <details className="relative inline-block bg-transparent">
        <summary
          style={{
            userSelect: "none",
            listStyle: "none",
          }}
        >
          <div className="border-2 rounded-full p-[2px] border-neutral-400/30 dark:border-neutral-800/50">
            <Avatar
              size="xl"
              src="/images/avatar.png"
              className="cursor-pointer"
            />
          </div>
        </summary>
        <div
          className="flex flex-col gap-1 w-36 items-start p-2 absolute top-full rounded-xl right-0 dark:bg-black/80 filter backdrop-blur-md bg-white/80 border-2 border-neutral-300/30 dark:border-neutral-900/50 shadow-lg shadow-neutral-200/50 dark:shadow-neutral-900/20"
          style={{ zIndex: 999 }}
        >
          <div className="text-xs font-semibold w-full flex justify-end">{`@username`}</div>
          <div className="flex flex-row w-full justify-end gap-1 items-center">
            <span className="text-xs text-neutral-400">{`v${version}`}</span>
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
                {resolvedTheme == "dark" ? <MdDarkMode /> : <MdLightMode />}
              </Button>
            </Tooltip>
          </div>
          <Button title="log out" fullWidth>
            <MdLogout />
            <span className="ml-1">log out</span>
          </Button>
          <Button title="modal" fullWidth onClick={() => setOpen(true)}>
            <span className="ml-1">modal</span>
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
