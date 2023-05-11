import { RiDashboardFill, RiDashboardLine } from "react-icons/ri";
import { AiFillApi, AiOutlineApi } from "react-icons/ai";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkCircleSharp,
} from "react-icons/io5";
import { RiTelegramLine, RiTelegramFill } from "react-icons/ri";
import { RiVipDiamondLine, RiVipDiamondFill } from "react-icons/ri";

import Tab from "@/components/Tab";
import View from "@/components/View";
import { formatDateToHuman } from "@/utils";
import { useProjectStore } from "@/stores/projectStore";
import Project from "./Project";
import API from "./API";
import Plan from "./Plan";

export default function Settings() {
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
            <RiVipDiamondFill />
            <span>Plan</span>
          </div>
        }
        nonActiveTitle={
          <div className="flex flex-row items-center gap-1">
            <RiVipDiamondLine />
            <span>Plan</span>
          </div>
        }
        id="plan"
        disabled
      >
        <Plan />
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
              <div>{`This project has been verified on ${formatDateToHuman({
                date: project?.verifiedAt ?? 0,
                output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
              })}`}</div>
            </View.If>
            <View.Else>
              <div className="w-full flex flex-col gap-2 items-start">
                <div>
                  You need to verify your project using production domain in
                  order to use some features.
                </div>
                <div>
                  You just need to send log request to Nexys from your
                  production domain. Nexys will automatically detect hostname
                  and verify your project.
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
        id="delete"
        disabled={true}
      >
        <div>Telegram will be enabled soon.</div>
      </Tab.TabView>
    </Tab>
  );
}
