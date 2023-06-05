import Settings from "./Tabs/Settings";
import Logs from "./Tabs/Logs";
import Overview from "./Tabs/Overview";
import Batches from "./Tabs/Batches";
import Exceptions from "./Tabs/Exceptions";
import Metrics from "./Tabs/Metrics";
import { MdOutlineErrorOutline, MdOutlineError } from "react-icons/md";
import {
  VscDebugBreakpointLogUnverified,
  VscDebugBreakpointLog,
} from "react-icons/vsc";
import {
  RiDashboardFill,
  RiDashboardLine,
  RiDashboard2Line,
  RiFilePaperFill,
  RiFilePaperLine,
  RiDashboard2Fill,
} from "react-icons/ri";
import { BsBarChartLineFill, BsBarChartLine } from "react-icons/bs";
import { HiOutlineFolderAdd, HiFolderAdd } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import type { TabViewProps } from "@/components/Tab/Tab.types";

export default [
  {
    activeTitle: (
      <div className="flex flex-row items-center gap-1">
        <RiDashboardFill />
        <span>Overview</span>
      </div>
    ),
    nonActiveTitle: (
      <div className="flex flex-row items-center gap-1">
        <RiDashboardLine />
        <span>Overview</span>
      </div>
    ),
    id: "overview",
    children: <Overview />,
  },
  {
    activeTitle: "Pages",
    nonActiveTitle: "Pages",
    id: "pages",
    children: <div>Pages</div>,
    disabled: true,
  },
  {
    activeTitle: (
      <div className="flex flex-row items-center gap-1">
        <MdOutlineError />
        <span>Exceptions</span>
      </div>
    ),
    nonActiveTitle: (
      <div className="flex flex-row items-center gap-1">
        <MdOutlineErrorOutline />
        <span>Exceptions</span>
      </div>
    ),
    id: "exceptions",
    children: <Exceptions />,
  },
  {
    activeTitle: (
      <div className="flex flex-row items-center gap-1">
        <VscDebugBreakpointLog />
        <span>Logs</span>
      </div>
    ),
    nonActiveTitle: (
      <div className="flex flex-row items-center gap-1">
        <VscDebugBreakpointLogUnverified />
        <span>Logs</span>
      </div>
    ),
    id: "logs",
    children: <Logs />,
  },
  {
    activeTitle: (
      <div className="flex flex-row items-center gap-1">
        <RiFilePaperFill />
        <span>Batches</span>
      </div>
    ),
    nonActiveTitle: (
      <div className="flex flex-row items-center gap-1">
        <RiFilePaperLine />
        <span>Batches</span>
      </div>
    ),
    id: "batches",
    children: <Batches />,
  },
  {
    activeTitle: (
      <div className="flex flex-row items-center gap-1">
        <BsBarChartLineFill />
        <span>Statistics</span>
      </div>
    ),
    nonActiveTitle: (
      <div className="flex flex-row items-center gap-1">
        <BsBarChartLine />
        <span>Statistics</span>
      </div>
    ),
    id: "statistics",
    children: <div>Under construction.</div>,
    disabled: true,
  },
  {
    activeTitle: "Requests",
    nonActiveTitle: "Requests",
    id: "requests",
    children: <div>Under construction.</div>,
    disabled: true,
  },
  {
    activeTitle: (
      <div className="flex flex-row items-center gap-1">
        <RiDashboard2Fill />
        <span>Metrics</span>
      </div>
    ),
    nonActiveTitle: (
      <div className="flex flex-row items-center gap-1">
        <RiDashboard2Line />
        <span>Metrics</span>
      </div>
    ),
    id: "metrics",
    children: <Metrics />,
    disabled: false,
  },
  {
    activeTitle: (
      <div className="flex flex-row items-center gap-1">
        <HiFolderAdd />
        <div className="break-keep">Add Channel</div>
      </div>
    ),
    nonActiveTitle: (
      <div className="flex flex-row items-center gap-1">
        <HiOutlineFolderAdd />
        <div className="break-keep">Add Channel</div>
      </div>
    ),
    id: "add-channel",
    children: <div>Under construction.</div>,
    disabled: true,
  },
  {
    activeTitle: (
      <div className="flex flex-row items-center gap-1">
        <IoMdSettings />
        <span>Settings</span>
      </div>
    ),
    nonActiveTitle: (
      <div className="flex flex-row items-center gap-1">
        <IoSettingsOutline />
        <span>Settings</span>
      </div>
    ),
    id: "settings",
    children: <Settings />,
  },
] as TabViewProps[];
