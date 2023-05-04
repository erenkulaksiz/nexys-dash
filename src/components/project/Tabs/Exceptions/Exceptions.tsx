import { useMemo } from "react";

import { useProjectStore } from "@/stores/projectStore";
import { MdError } from "react-icons/md";
import LogBatch from "../../LogBatch";

export default function Exceptions() {
  const project = useProjectStore((state) => state.currentProject);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row justify-between items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <MdError />
              <span>Exceptions</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {!exceptionTypeExist && <div>No exceptions found.</div>}
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
    </div>
  );
}
