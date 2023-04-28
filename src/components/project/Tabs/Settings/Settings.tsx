import Link from "next/link";
import { RiDashboardFill, RiDashboardLine } from "react-icons/ri";
import { AiFillApi, AiOutlineApi } from "react-icons/ai";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkCircleSharp,
} from "react-icons/io5";
import { MdRefresh } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";

import { deleteProject } from "@/utils/deleteProject";
import Codeblock from "@/components/Codeblock";
import Tab from "@/components/Tab";
import Tooltip from "@/components/Tooltip";
import Button from "@/components/Button";
import { Log, formatDateToHuman } from "@/utils";
import { setProjectLoading, useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";

export default function Settings() {
  const router = useRouter();
  const project = useProjectStore((state) => state.currentProject);
  const validatedUser = useAuthStore((state) => state.validatedUser);

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
    setProjectLoading(false);
  }

  return (
    <Tab id="settings">
      <Tab.TabView
        activeTitle={
          <div className="flex flex-row items-center gap-1">
            <RiDashboardFill />
            <span>Project</span>
          </div>
        }
        nonActiveTitle={
          <div className="flex flex-row items-center gap-1">
            <RiDashboardLine />
            <span>Project</span>
          </div>
        }
        id="project"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 pt-2 gap-4">
          <div className="flex flex-col gap-2 items-start">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="projectName">Project Name</label>
              <Codeblock data={project?.name}>{project?.name}</Codeblock>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="projectName">Project Domain</label>
              <Codeblock data={project?.domain}>{project?.domain}</Codeblock>
              <div className="text-neutral-500 text-sm">
                This domain should match where you are using Nexys Client
                Library.
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-2 items-start">
                <span>Project Creation</span>
                <span className="dark:text-neutral-600 text-neutral-400">
                  {formatDateToHuman({
                    date: project?.createdAt ?? "",
                    output:
                      "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
                  })}
                </span>
              </div>
              <div className="flex flex-row gap-2 items-start">
                <span>Project Last Update</span>
                <span className="dark:text-neutral-600 text-neutral-400">
                  {formatDateToHuman({
                    date: project?.createdAt ?? "",
                    output:
                      "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
                  })}
                </span>
              </div>
            </div>
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
        </div>
      </Tab.TabView>
      <Tab.TabView
        activeTitle={
          <div className="flex flex-row items-center gap-1">
            <AiFillApi />
            <span>API</span>
          </div>
        }
        nonActiveTitle={
          <div className="flex flex-row items-center gap-1">
            <AiOutlineApi />
            <span>API</span>
          </div>
        }
        id="api"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 pt-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="projectName">Public API Key</label>
            <div className="flex flex-row gap-2">
              <Codeblock data={project?.publicKey}>
                {project?.publicKey}
              </Codeblock>
            </div>
            <span className="text-neutral-500 text-sm">
              This API key should be used with Nexys Client Library.{" "}
              <Link href="https://docs.nexys.app" target="_blank">
                <span className="text-blue-600 font-semibold">Visit Docs</span>
              </Link>
            </span>
          </div>
        </div>
      </Tab.TabView>
      <Tab.TabView
        activeTitle={
          <div className="flex flex-row items-center gap-1">
            <IoCheckmarkCircleSharp />
            <span>Verify</span>
          </div>
        }
        nonActiveTitle={
          <div className="flex flex-row items-center gap-1">
            <IoCheckmarkCircleOutline />
            <span>Verify</span>
          </div>
        }
        id="verify"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 pt-2 gap-4">
          {project?.verified ? (
            <div>{`This project has been verified on ${formatDateToHuman({
              date: project.verifiedAt ?? 0,
              output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
            })}`}</div>
          ) : (
            <div className="w-full flex flex-col gap-2 items-start">
              <div>
                In order to get started with your project, you must verify your
                domain with this project.
              </div>
              <div>
                Call this function in your client library to verify your domain.
              </div>
              <div className="w-full">
                <Codeblock>{`nexys.verify();`}</Codeblock>
              </div>
              <div>
                {
                  "Make sure you are on your domain (not localhost), and you have added your project's public API key to your client library. We check if request is made from your domain."
                }
              </div>
              <div>
                After calling the function, just press the button below.
              </div>
              <Button
                className="px-2 dark:text-white"
                onClick={() => router.reload()}
              >
                <span className="mr-1">
                  <MdRefresh size={18} />
                </span>
                <span>Refresh</span>
              </Button>
            </div>
          )}
        </div>
      </Tab.TabView>
    </Tab>
  );
}
