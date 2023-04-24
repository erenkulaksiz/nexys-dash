import Link from "next/link";
import { CiShare1 } from "react-icons/ci";

import Button from "@/components/Button";
import Container from "@/components/Container";
import { useProjectStore } from "@/stores/projectStore";

export default function Header() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <div className="flex z-40 flex-row gap-2 items-end py-4 border-b-[1px] border-neutral-200 dark:border-neutral-900">
      <Container className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">{project?.name}</h1>
            <h2 className="text-neutral-500">{project?.domain}</h2>
          </div>
          <div
            className={
              project?.verified
                ? "bg-green-600 px-2 rounded-full text-xs text-white"
                : "bg-red-600 px-2 rounded-full text-xs text-white"
            }
          >
            {project?.verified ? "Verified" : "Unverified"}
          </div>
        </div>
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
      </Container>
    </div>
  );
}
