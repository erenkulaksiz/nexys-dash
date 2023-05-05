import { RiDashboard3Line } from "react-icons/ri";
import { IoFlagOutline } from "react-icons/io5";
import { MdAccessTime, MdInfo } from "react-icons/md";
import CountUp from "react-countup";
import { useMemo } from "react";
import dynamic from "next/dynamic";

import LogBatch from "../../LogBatch";
import Loading from "@/components/Loading";
import { useProjectStore } from "@/stores/projectStore";
import { BuildComponent } from "@/utils/style";
import Tooltip from "@/components/Tooltip";
import { Log } from "@/utils";

const Statistics = dynamic(() => import("./Statistics"), {
  loading: () => <Loading />,
});

export default function Overview() {
  const project = useProjectStore((state) => state.currentProject);

  const allLogs = useMemo(
    () =>
      project?.logs
        ?.map((log) => log.data.logs?.map((log: any) => log?.options?.type))
        .flat(),
    [project?.logs]
  );
  let logCounts = {
    "AUTO:ERROR": 0,
    "AUTO:UNHANDLEDREJECTION": 0,
    ERROR: 0,
  } as { [key: string]: number };
  allLogs?.forEach((x: any) => {
    logCounts[x as any] = (logCounts[x] || 0) + 1;
  });
  const total = Object.values(logCounts).reduce((a, b) => a + b, 0);
  const errorCount =
    logCounts["AUTO:ERROR"] +
    logCounts["AUTO:UNHANDLEDREJECTION"] +
    logCounts["ERROR"];
  const isProjectNew = project?.logs?.length == 0;
  const projectScore = isProjectNew
    ? 100
    : Math.abs(100 - (errorCount / total) * 100);

  const exceptionTypeExist = useMemo(
    () =>
      project?.logs
        ?.map((log: any) => {
          const logsArr = log.data.logs.filter((log: any) => {
            const typeException =
              log?.options?.type == "AUTO:ERROR" ||
              log?.options?.type == "ERROR" ||
              log?.options?.type == "AUTO:UNHANDLEDREJECTION";
            if (typeException) {
              return true;
            }
            return false;
          });
          if (logsArr.length) {
            return true;
          }
          return false;
        })
        .includes(true),
    [project?.logs]
  );

  function getProjectScoreMessage() {
    if (projectScore > 80) {
      return "Perfect!";
    } else if (projectScore >= 80) {
      return "Nearly bug free";
    } else if (projectScore >= 70) {
      return "Nice";
    } else if (projectScore >= 50) {
      return "Good";
    } else if (projectScore >= 30) {
      return "Needs improvement";
    } else {
      return "Needs improvement";
    }
  }

  function getProjectScoreColor() {
    if (projectScore >= 80) {
      return "border-green-600 text-green-600";
    } else if (projectScore >= 70) {
      return "border-yellow-600 text-yellow-600";
    } else if (projectScore >= 50) {
      return "border-yellow-600 text-yellow-600";
    } else if (projectScore >= 30) {
      return "border-yellow-600 text-yellow-600";
    } else {
      return "border-red-600 text-red-600";
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2 pt-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="border-b-[1px] border-neutral-200 dark:border-neutral-900 w-full">
          <div className="flex flex-row gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <IoFlagOutline />
            <span>Project Score</span>
          </div>
          <div className="p-4 flex flex-col items-center gap-2">
            <div
              className={
                BuildComponent({
                  name: "Count Up",
                  defaultClasses:
                    "w-24 h-24 font-semibold text-2xl flex items-center justify-center border-4 rounded-full",
                  extraClasses: getProjectScoreColor(),
                }).classes
              }
            >
              <CountUp end={projectScore} duration={2} />
            </div>
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-row w-full items-center justify-center gap-1">
                <Tooltip
                  outline
                  content="Project score calculated by (error/total) logs."
                >
                  <MdInfo />
                </Tooltip>
                <span className="text-xl text-center font-semibold">
                  {getProjectScoreMessage()}
                </span>
              </div>
              {!isProjectNew && (
                <span className="text-sm text-neutral-500">
                  {errorCount} error(s) / {total} log(s)
                </span>
              )}
              {isProjectNew && (
                <span className="text-sm text-neutral-500">No logs yet.</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <MdAccessTime />
            <span>Last exceptions</span>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {((project && project.logs?.length == 0) ||
              !exceptionTypeExist) && <div>Vola! No exceptions found.</div>}
            {project &&
              Array.isArray(project.logs) &&
              project.logs &&
              project.logs?.length > 0 &&
              project.logs.map((batch) => {
                return (
                  <LogBatch batch={batch} key={batch._id} type="exception" />
                );
              })}
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-lg border-[1px] border-neutral-200 dark:border-neutral-900">
        <div className="flex flex-row gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
          <RiDashboard3Line size={14} />
          <span>Statistics</span>
        </div>
        <div className="w-full p-4">
          <Statistics />
        </div>
      </div>
    </div>
  );
}
