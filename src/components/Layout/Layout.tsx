import { useEffect } from "react";
import { useRouter } from "next/router";

import { Log } from "@/utils";
import type { NexysComponentProps } from "@/types";

interface LayoutProps extends NexysComponentProps {
  withoutLayout?: boolean;
}

export default function Layout(props: LayoutProps) {
  if (props.withoutLayout) return <>{props.children}</>;

  return (
    <main className="mx-auto transition-all overflow-x-hidden ease-in-out duration-300 overflow-auto dark:bg-black/50 bg-white h-full items-center w-full flex flex-col dark:text-white relative text-black">
      {props.children}
    </main>
  );
}
