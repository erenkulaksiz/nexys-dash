import { RiDashboardFill, RiDashboardLine } from "react-icons/ri";
import { AiFillApi, AiOutlineApi } from "react-icons/ai";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkCircleSharp,
} from "react-icons/io5";
import { RiTelegramLine, RiTelegramFill } from "react-icons/ri";
import { RiVipDiamondLine, RiVipDiamondFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";

import Tab from "@/components/Tab";
import View from "@/components/View";
import { formatDateToHuman } from "@/utils";
import { useProjectStore } from "@/stores/projectStore";
import Project from "./Project";
import API from "./API";
import Telegram from "./Telegram";

export default function Settings() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <div className="grid gap-2 py-2 pt-2 items-start max-w-full">
      <div className="border-[1px] sm:order-first min-w-full order-last border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-row gap-2 w-full items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
          <IoMdSettings />
          <span>Settings</span>
        </div>
        <div className="flex p-4 pt-1 flex-col w-full">
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
                <View viewIf={project?.verified}>
                  <View.If>
                    <div className="flex flex-row items-center gap-1">
                      <MdOutlineDone />
                      <div>{`This project has been verified on ${formatDateToHuman(
                        {
                          date: project?.verifiedAt ?? 0,
                          output:
                            "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
                        }
                      )}`}</div>
                    </div>
                  </View.If>
                  <View.Else>
                    <div className="w-full flex flex-col gap-2 items-start">
                      <div>
                        You need to verify your project using production domain
                        in order to use some features.
                      </div>
                      <div>
                        You just need to send log request to Nexys from your
                        production domain. Nexys will automatically detect
                        hostname and verify your project.
                      </div>
                    </div>
                  </View.Else>
                </View>
              </div>
            </Tab.TabView>
            <Tab.TabView
              activeTitle={
                <div className="flex flex-row items-center gap-1">
                  <RiTelegramFill />
                  <span>Telegram</span>
                </div>
              }
              nonActiveTitle={
                <div className="flex flex-row items-center gap-1">
                  <RiTelegramLine />
                  <span>Telegram</span>
                </div>
              }
              id="telegram"
              disabled={true}
            >
              <Telegram />
            </Tab.TabView>
          </Tab>
        </div>
      </div>
    </div>
  );
}
