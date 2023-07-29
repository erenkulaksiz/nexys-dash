import { useState } from "react";

import { RiFilterLine, RiFilterFill } from "react-icons/ri";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { useProjectStore } from "@/stores/projectStore";
import useLogs from "@/hooks/useLogs";
import LogCard from "@/components/project/LogCard";
import Pager from "@/components/Pager";
import View from "@/components/View";
import Button from "@/components/Button";
import CurrentCountText from "@/components/project/CurrentCountText";
import LogFilters, { LogFiltersProps } from "@/components/project/LogFilters";

export default function Logs() {
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [filters, setFilters] = useState<LogFiltersProps>({
    asc: false,
    path: "all",
  });
  const project = useProjectStore((state) => state.currentProject);
  const logs = useLogs({
    type: "logs",
    page,
    types: [],
    path: filters.path,
    asc: filters.asc,
    action: filters.action,
  });
  const logsLoading = useProjectStore((state) => state.logsLoading);
  const totalPages = Math.ceil(logs.data?.data?.logsLength / 10);

  const logPaths = logs.data?.data?.logPaths
    ? [...logs.data?.data?.logPaths]
    : [];
  const logActions = logs.data?.data?.logActions
    ? [...logs.data?.data?.logActions]
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <VscDebugBreakpointLog />
              <span>Logs</span>
            </div>
            <View.If visible={!logsLoading && !!logs.data?.data?.logsLength}>
              <CurrentCountText
                count={logs.data?.data?.logsLength}
                type="logs"
              />
            </View.If>
          </div>
          <View.If hidden={logsLoading}>
            <div className="flex flex-col gap-2 p-4 pb-0">
              <div className="flex flex-row gap-2 items-center">
                <Button
                  className="px-2"
                  size="h-8"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <View viewIf={filtersOpen}>
                    <View.If>
                      <RiFilterFill />
                    </View.If>
                    <View.Else>
                      <RiFilterLine />
                    </View.Else>
                  </View>
                  <span className="ml-1">Filters</span>
                </Button>
              </div>
              <View.If visible={filtersOpen}>
                <LogFilters
                  filters={filters}
                  setFilters={setFilters}
                  logPaths={logPaths}
                  logActions={logActions}
                />
              </View.If>
              <View.If visible={!logsLoading && totalPages > 1}>
                <Pager
                  currentPage={page}
                  totalPages={totalPages}
                  perPage={4}
                  onPageClick={(page) => setPage(page)}
                  onPreviousClick={() => page != 0 && setPage(page - 1)}
                  onNextClick={() => page + 1 < totalPages && setPage(page + 1)}
                />
              </View.If>
            </div>
          </View.If>
          <div className="flex flex-col gap-2 p-4">
            <View.If visible={logsLoading}>
              {Array.from(Array(3)).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-neutral-100 dark:bg-neutral-900 py-20 px-10"
                ></div>
              ))}
            </View.If>
            <View.If
              visible={!logsLoading && logs.data?.data?.logs?.length == 0}
            >
              <div>No logs found.</div>
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
                return <LogCard log={log} key={log._id} />;
              })}
            </View.If>
          </div>
        </div>
      </div>
    </div>
  );
}
