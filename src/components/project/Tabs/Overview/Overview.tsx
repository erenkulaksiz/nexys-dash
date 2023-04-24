import { RiDashboard3Line } from "react-icons/ri";
import { RxActivityLog } from "react-icons/rx";
import { IoFlagOutline } from "react-icons/io5";

import LogBatch from "../../LogBatch";
import { useProjectStore } from "@/stores/projectStore";

export default function Overview() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2 pt-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="border-b-[1px] border-neutral-200 dark:border-neutral-900 w-full">
          <div className="flex flex-row gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <IoFlagOutline size={14} />
            <span>Project Score</span>
          </div>
          <div className="p-4 flex flex-col items-center gap-2">
            <div className="w-24 h-24 font-semibold text-2xl flex items-center justify-center border-4 border-green-600 text-green-600 rounded-full">
              94
            </div>
            <span className="text-lg">Nearly bug free</span>
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <RxActivityLog size={14} />
            <span>Last exceptions</span>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {project && project.logs?.length == 0 && (
              <div>Vola! No exceptions found.</div>
            )}
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
        <div className="w-full p-4"></div>
      </div>
    </div>
  );
}
