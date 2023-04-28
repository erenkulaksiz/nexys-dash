import { RxActivityLog } from "react-icons/rx";

import LogBatch from "../../LogBatch/LogBatch";
import { useProjectStore } from "@/stores/projectStore";
import { Log } from "@/utils";

export default function Logs() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row justify-between items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <RxActivityLog size={14} />
              <span>Logs</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {project && project.logs?.length == 0 && <div>No logs found.</div>}
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
