import Link from "next/link";
import { CiShare1 } from "react-icons/ci";

import Button from "@/components/Button";
import Container from "@/components/Container";
import Avatar from "../Avatar";
import { useProjectStore } from "@/stores/projectStore";

export default function Header() {
  const project = useProjectStore((state) => state.currentProject);
  const loading = useProjectStore((state) => state.loading);

  return (
    <div className="flex z-40 flex-row gap-2 items-end py-4 border-b-[1px] border-neutral-200 dark:border-neutral-900">
      <Container className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          {loading && (
            <div className="animate-pulse flex flex-col gap-2">
              <div className="h-5 bg-neutral-100 dark:bg-neutral-900 w-48"></div>
              <div className="h-2.5 bg-neutral-100 dark:bg-neutral-900 w-32"></div>
            </div>
          )}
          {!loading && (
            <div className="flex flex-row items-center gap-3">
              <Avatar size="2xl" src="/images/avatar.png" />
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold">{project?.name}</h1>
                <h2 className="text-neutral-500">{project?.domain}</h2>
              </div>
            </div>
          )}
          {!loading && (
            <div
              className={
                project?.verified
                  ? "bg-green-600 px-2 rounded-full text-xs text-white"
                  : "bg-red-600 px-2 rounded-full text-xs text-white"
              }
            >
              {project?.verified ? "Verified" : "Unverified"}
            </div>
          )}
        </div>
        {!loading && (
          <div>
            <Link href={`https://${project?.domain}` ?? ""} target="_blank">
              <Button
                light="dark:bg-white bg-black dark:text-black"
                className="px-4  text-white"
              >
                <CiShare1 className="mr-1" />
                <span>Visit</span>
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
