import Link from "next/link";
import { RiDashboardFill, RiDashboardLine } from "react-icons/ri";
import { AiFillApi, AiOutlineApi } from "react-icons/ai";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkCircleSharp,
} from "react-icons/io5";
import { MdRefresh } from "react-icons/md";
import { useRouter } from "next/router";

import Codeblock from "@/components/Codeblock";
import Tab from "@/components/Tab";
import Button from "@/components/Button";
import { formatDateToHuman } from "@/utils";
import { useProjectStore } from "@/stores/projectStore";

import Project from "./Project";
import API from "./API";

export default function Settings() {
  const router = useRouter();
  const project = useProjectStore((state) => state.currentProject);

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
        <Project />
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
        <API />
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
                You need to verify your project using production domain in order
                to use some features.
              </div>
              <div>
                You just need to send log request to Nexys from your production
                domain. Nexys will automatically detect hostname and verify your
                project.
              </div>
              <div>
                Verifying your project will enable you to use more features.
              </div>
            </div>
          )}
        </div>
      </Tab.TabView>
    </Tab>
  );
}
