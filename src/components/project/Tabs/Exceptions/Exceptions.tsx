import { useEffect, useState } from "react";

import { RiFilterLine, RiFilterFill } from "react-icons/ri";
import { useProjectStore } from "@/stores/projectStore";
import { MdError } from "react-icons/md";
import useLogs from "@/hooks/useLogs";
import LogCard from "@/components/project/LogCard";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import ExceptionFilters from "@/components/project/ExceptionFilters";
import CurrentCountText from "@/components/project/CurrentCountText";
import View from "@/components/View";
import { Log } from "@/utils";
import type { ExceptionFiltersProps } from "@/components/project/ExceptionFilters";

export default function Exceptions() {
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<ExceptionFiltersProps>({
    asc: false,
    types: [],
    path: "all",
  });
  const [page, setPage] = useState<number>(0);
  const project = useProjectStore((state) => state.currentProject);
  const exceptions = useLogs({
    type: "exceptions",
    page,
    path: filters.path,
    batchVersion: filters.batchVersion,
    asc: filters.asc,
    types: filters.types,
    configUser: filters.configUser,
  });

  const exceptionsLoading = useProjectStore((state) => state.exceptionsLoading);
  const totalPages = Math.ceil(exceptions.data?.data?.exceptionsLength / 10);

  const exceptionPaths = exceptions.data?.data?.exceptionPaths
    ? [...exceptions.data?.data?.exceptionPaths]
    : [];
  const exceptionTypes = exceptions.data?.data?.exceptionTypes
    ? [...exceptions.data?.data?.exceptionTypes]
    : [];
  const batchVersions = exceptions.data?.data?.batchVersions
    ? [...exceptions.data?.data?.batchVersions]
    : [];
  const configUsers = exceptions.data?.data?.batchConfigUsers
    ? [...exceptions.data?.data?.batchConfigUsers]
    : [];

  useEffect(() => {
    setPage(0);
  }, [filters]);

  useEffect(() => {
    if (exceptions?.data?.data) {
      exceptions.mutate();
    }
  }, [filters.types]);

  useEffect(() => {
    setFilters({
      ...filters,
      types: [],
    });
  }, [filters.path]);

  useEffect(() => {
    setFilters({
      ...filters,
      types: [],
      path: "all",
    });
  }, [filters.batchVersion]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <MdError />
              <span>Exceptions</span>
              {exceptions.isValidating && <Loading />}
            </div>
            <View.If
              visible={
                !exceptionsLoading &&
                exceptions.data?.data?.exceptionsLength != 0
              }
            >
              <CurrentCountText
                count={exceptions.data?.data?.exceptionsLength}
                type="exceptions"
              />
            </View.If>
          </div>
          <View.If hidden={exceptionsLoading}>
            <div className="flex flex-col items-start gap-2 p-4 pb-0">
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
                <ExceptionFilters
                  setFilters={setFilters}
                  filters={filters}
                  exceptionPaths={exceptionPaths}
                  exceptionTypes={exceptionTypes}
                  batchVersions={batchVersions}
                  configUsers={configUsers}
                  configUser={filters.configUser}
                  batchVersion={filters.batchVersion}
                />
              </View.If>
              <View.If visible={!exceptionsLoading && totalPages > 1}>
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
            <View.If visible={exceptionsLoading}>
              {Array.from(Array(3)).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-neutral-100 dark:bg-neutral-900 py-20 px-10"
                ></div>
              ))}
            </View.If>
            <View.If
              visible={
                !exceptionsLoading &&
                exceptions.data?.data?.exceptions?.length == 0
              }
            >
              <div>No exceptions found.</div>
            </View.If>
            <View.If
              visible={
                !exceptionsLoading &&
                project &&
                Array.isArray(exceptions.data?.data?.exceptions) &&
                exceptions.data?.data?.exceptions &&
                exceptions.data?.data?.exceptions.length > 0
              }
            >
              {exceptions.data?.data?.exceptions.map((exception: any) => {
                return <LogCard log={exception} key={exception._id} />;
              })}
            </View.If>
          </div>
        </div>
      </div>
    </div>
  );
}
