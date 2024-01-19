import { useState } from "react";

import { useProjectStore } from "@/stores/projectStore";
import { MdError } from "react-icons/md";
import useLogs from "@/hooks/useLogs";
import LogCard from "@/components/project/LogCard";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import CurrentCountText from "@/components/project/CurrentCountText";
import View from "@/components/View";
import InputFilter from "@/components/project/InputFilter";
import type { filtersTypes } from "@/components/project/InputFilter/InputFilter.types";

export default function Exceptions() {
  const [page, setPage] = useState<number>(0);
  const project = useProjectStore((state) => state.currentProject);
  const [filters, setFilters] = useState<filtersTypes[]>([]);
  const exceptions = useLogs({
    type: "exceptions",
    page,
    filters,
  });
  const exceptionsLoading = useProjectStore((state) => state.exceptionsLoading);
  const totalPages = Math.ceil(exceptions.data?.data?.exceptionsLength / 10);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <MdError />
              <span>Exceptions</span>
              <View.If visible={exceptions.isValidating}>
                <Loading />
              </View.If>
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
          <InputFilter
            filters={filters}
            setFilters={setFilters}
            type="exceptions"
          />
          <View.If visible={!exceptionsLoading && totalPages > 1}>
            <div className="flex flex-col items-start gap-2 p-4 pb-0">
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
                return <LogCard log={exception} key={exception._id.$oid} />;
              })}
            </View.If>
          </div>
        </div>
      </div>
    </div>
  );
}
