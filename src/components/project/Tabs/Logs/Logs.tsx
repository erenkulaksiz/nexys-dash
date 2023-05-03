import { VscDebugBreakpointLog } from "react-icons/vsc";
import { useMemo } from "react";

import LogBatch from "../../LogBatch/LogBatch";
import { useProjectStore } from "@/stores/projectStore";
import { Log } from "@/utils";

export default function Logs() {
  const project = useProjectStore((state) => state.currentProject);

  Log.debug("zzzz", project?.logs);

  const logTypeExist = useMemo(
    () =>
      project?.logs
        ?.map((log: any) => {
          const logsArr = log.data.logs.filter((log: any) => {
            const typeLog =
              log?.options?.type != "AUTO:ERROR" &&
              log?.options?.type != "ERROR" &&
              log?.options?.type != "AUTO:UNHANDLEDREJECTION" &&
              log?.options?.type != "METRIC";
            if (typeLog) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row justify-between items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <VscDebugBreakpointLog />
              <span>Logs</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {!logTypeExist && <div>No logs found.</div>}
            {project &&
              Array.isArray(project.logs) &&
              project.logs &&
              project.logs?.length > 0 &&
              project.logs.map((batch) => {
                return <LogBatch batch={batch} key={batch._id} type="log" />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
