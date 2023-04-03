import { CiShare1 } from "react-icons/ci";

import Avatar from "@/components/Avatar";
import type { ProjectCardProps } from "./ProjectCard.types";

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="relative group dark:bg-black bg-white rounded-lg p-4 h-32 cursor-pointer border-[1px] border-neutral-300/30 dark:border-neutral-600/50 hover:dark:border-neutral-300 hover:border-neutral-200">
      <div className="flex flex-row gap-2">
        <Avatar size="2xl" src="/images/avatar.png" />
        <div className="flex flex-col">
          <span className="font-semibold text-lg">{project?.name}</span>
          <span className="text-neutral-500">{project?.domain}</span>
        </div>
      </div>
      <div className="absolute right-0 top-0 translate-x-4 translate-y-2 group-hover:z-20 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-200 ease-in-out bg-white dark:bg-black p-2 border-[1px] border-neutral-200 dark:border-neutral-300 rounded-full opacity-0 group-hover:opacity-100">
        <CiShare1 size={16} />
      </div>
    </div>
  );
}
