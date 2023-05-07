import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";

import Codeblock from "@/components/Codeblock";
import Tooltip from "@/components/Tooltip";
import Button from "@/components/Button";
import { LIMITS } from "@/constants";
import { useProjectStore, setProjectLoading } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import { deleteProject } from "@/utils/service/project/delete";
import { Log, formatDateToHuman } from "@/utils";
import { nexys } from "@/utils/nexys";

export default function Project() {
  const project = useProjectStore((state) => state.currentProject);
  const validatedUser = useAuthStore((state) => state.validatedUser);
  const router = useRouter();

  async function onDelete() {
    setProjectLoading(true);
    if (!project?._id) return;
    const res = await deleteProject({
      id: project?._id.toString() || "",
      uid: validatedUser?.uid || "",
    });

    if (res.success) {
      router.push("/");
      return;
    }

    Log.error("Countered an error while deleting project.", res.error);
    nexys.log(
      {
        id: project?._id,
      },
      { action: "DELETE_PROJECT" }
    );
    setProjectLoading(false);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 pt-2 gap-4">
      <div className="flex flex-col gap-2 items-start">
        <div className="flex flex-col w-full">
          <label htmlFor="projectName">Project Name</label>
          <Codeblock data={project?.name}>{project?.name}</Codeblock>
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="projectName">Project Domain</label>
          <Codeblock data={project?.domain}>{project?.domain}</Codeblock>
          <div className="text-neutral-500 text-sm">
            This domain should match where you are using Nexys Client Library.
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-2 items-start">
            <span>Project Creation</span>
            <time
              dateTime={project?.createdAt?.toString()}
              className="dark:text-neutral-600 text-neutral-400"
            >
              {formatDateToHuman({
                date: project?.createdAt ?? "",
                output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
              })}
            </time>
          </div>
          <div className="flex flex-row gap-2 items-start">
            <span>Project Last Update</span>
            <time
              dateTime={project?.updatedAt?.toString()}
              className="dark:text-neutral-600 text-neutral-400"
            >
              {formatDateToHuman({
                date: project?.updatedAt ?? "",
                output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
              })}
            </time>
          </div>
        </div>
        <Tooltip content="Will be activated soon.">
          <Button className="px-2" onClick={() => {}}>
            <span className="mr-1">
              <MdDelete size={18} />
            </span>
            <span>Clear Logs</span>
          </Button>
        </Tooltip>

        <Tooltip content="This action cannot be undone!">
          <Button
            light="dark:bg-red-700 bg-red-600"
            className="px-2 text-white"
            onClick={onDelete}
          >
            <span className="mr-1">
              <MdDelete size={18} />
            </span>
            <span>Delete Project</span>
          </Button>
        </Tooltip>
      </div>
      <div>
        <div className="flex flex-col w-full">
          <label htmlFor="projectName">Log Usage</label>
          <Codeblock data={project?.logUsage?.toString() ?? "0"}>
            {project?.logUsage?.toString() ?? "0"}
          </Codeblock>
          <div className="text-neutral-500 text-sm">
            Each log request will be counted as usage.
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="projectName">Log Usage Limit</label>
          <Codeblock data={project?.logUsageLimit?.toString() ?? "0"}>
            {project?.logUsageLimit?.toString() ?? LIMITS.MAX.LOG_USAGE_LIMIT}
          </Codeblock>
        </div>
      </div>
    </div>
  );
}
