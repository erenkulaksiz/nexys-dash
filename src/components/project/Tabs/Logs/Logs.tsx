import { useState } from "react";

import { VscDebugBreakpointLog } from "react-icons/vsc";
import { useProjectStore } from "@/stores/projectStore";
import useLogs from "@/hooks/useLogs";
import LogCard from "@/components/project/LogCard";
import Pager from "@/components/Pager";

export default function Logs() {
  const [page, setPage] = useState<number>(0);
  const project = useProjectStore((state) => state.currentProject);
  const logs = useLogs({ type: "logs", page });
  const logsLoading = useProjectStore((state) => state.logsLoading);

  const totalPages = Math.ceil(logs.data?.data?.logsLength / 10);

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
          {!logsLoading && totalPages > 1 && (
            <div className="flex flex-col gap-2 p-4 pb-0">
              <Pager
                currentPage={page}
                totalPages={totalPages}
                perPage={2}
                onPageClick={(page) => setPage(page)}
                onPreviousClick={() => page != 0 && setPage(page - 1)}
                onNextClick={() => page + 1 < totalPages && setPage(page + 1)}
              />
            </div>
          )}
          <div className="flex flex-col gap-2 p-4">
            {logsLoading &&
              Array.from(Array(3)).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-neutral-100 dark:bg-neutral-900 py-20 px-10"
                ></div>
              ))}
            {!logsLoading && logs.data?.data?.logs?.length == 0 && (
              <div>No logs found.</div>
            )}
            {!logsLoading &&
              project &&
              Array.isArray(logs.data?.data?.logs) &&
              logs.data?.data?.logs &&
              logs.data?.data?.logs?.length > 0 &&
              logs.data?.data?.logs?.map((log: any) => {
                return <LogCard log={log} key={log._id} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
