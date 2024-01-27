import { CiShare1 } from "react-icons/ci";
import { MdError } from "react-icons/md";
import { HiCheckCircle } from "react-icons/hi";
import { RiGlobalLine } from "react-icons/ri";

import Tooltip from "@/components/Tooltip";
import View from "@/components/View";
import Avatar from "@/components/Avatar";
import type { ProjectCardProps } from "./ProjectCard.types";

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="relative group flex flex-row gap-2 dark:bg-black bg-white rounded-lg p-4 h-32 cursor-pointer border-[1px] border-neutral-200 dark:border-neutral-900 hover:dark:border-neutral-300 hover:border-neutral-400">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Avatar size="2xl" src="/images/avatar.png" />
          <div className="flex flex-col">
            <div className="flex items-center flex-row gap-1">
              <span className="font-semibold text-lg">{project?.name}</span>
              <Tooltip
                outline
                content={project.verified ? "Verified" : "Unverified"}
              >
                <div
                  className={
                    project.verified ? "text-green-600" : "text-red-600"
                  }
                >
                  <View viewIf={project.verified}>
                    <View.If>
                      <HiCheckCircle />
                    </View.If>
                    <View.Else>
                      <MdError />
                    </View.Else>
                  </View>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="text-neutral-500 flex flex-row items-center gap-1">
          <span>
            <RiGlobalLine />
          </span>
          <span>{project?.domain}</span>
        </div>
      </div>
      <View.If visible={project?.logUsage != 0}>
        <div className="text-neutral-400 text-sm flex flex-col flex-1 items-end">{`${project?.logUsage} logs`}</div>
      </View.If>
      <div className="absolute right-0 top-0 translate-x-4 translate-y-2 group-hover:z-20 group-hover:translate-x-4 group-hover:-translate-y-4 transition-all duration-200 ease-in-out bg-white dark:bg-black p-2 border-[1px] border-neutral-200 dark:border-neutral-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:border-neutral-400">
        <CiShare1 size={16} />
      </div>
    </div>
  );
}
