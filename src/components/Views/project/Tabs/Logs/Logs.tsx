import { useEffect, useState } from "react";

import { VscDebugBreakpointLog } from "react-icons/vsc";
import { useProjectStore } from "@/stores/projectStore";
import useLogs from "@/hooks/useLogs";
import LogCard from "@/components/Views/project/LogCard";
import Pager from "@/components/Pager";
import View from "@/components/View";
import Loading from "@/components/Loading";
import CurrentCountText from "@/components/Views/project/CurrentCountText";
import InputFilter from "@/components/Views/project/InputFilter";
import type { filtersTypes } from "@/components/Views/project/InputFilter/InputFilter.types";

export default function Logs() {
  const [page, setPage] = useState<number>(0);
  const [filters, setFilters] = useState<filtersTypes[]>([]);
  const project = useProjectStore((state) => state.currentProject);
  const logs = useLogs({
    type: "logs",
    page,
    filters,
  });
  const logsLoading = useProjectStore((state) => state.logsLoading);
  const totalPages = Math.ceil(logs.data?.data?.logsLength / 10);

  useEffect(() => {
    setPage(0);
  }, [filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-dark-border rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-dark-border">
            <div className="flex flex-row gap-2 items-center">
              <VscDebugBreakpointLog />
              <span className="dark:text-dark-text">Logs</span>
              {logs.isValidating && <Loading />}
            </div>
            <View.If visible={!logsLoading && !!logs.data?.data?.logsLength}>
              <CurrentCountText
                count={logs.data?.data?.logsLength}
                type="logs"
              />
            </View.If>
          </div>
          <InputFilter filters={filters} setFilters={setFilters} type="logs" />
          <View.If visible={!logsLoading && totalPages > 1}>
            <div className="flex flex-col gap-2 p-4 pb-0">
              <Pager
                currentPage={page}
                totalPages={totalPages}
                perPage={4}
                onPageClick={(page) => setPage(page)}
                onPreviousClick={() => page != 0 && setPage(page - 1)}
                onNextClick={() => page + 1 < totalPages && setPage(page + 1)}
              />
            </div>
          </View.If>
          <div className="flex flex-col gap-2 p-4">
            <View.If visible={logsLoading}>
              {Array.from(Array(3)).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-neutral-100 dark:bg-darker py-20 px-10"
                ></div>
              ))}
            </View.If>
            <View.If
              visible={!logsLoading && logs.data?.data?.logs?.length == 0}
            >
              <div className="dark:text-dark-accent">No logs found.</div>
            </View.If>
            <View.If
              visible={
                !logsLoading &&
                project &&
                Array.isArray(logs.data?.data?.logs) &&
                logs.data?.data?.logs
              }
            >
              {logs.data?.data?.logs?.map((log: any) => {
                return <LogCard log={log} key={log._id?.$oid} />;
              })}
            </View.If>
          </div>
        </div>
      </div>
    </div>
  );
}
