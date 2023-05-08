import { useState } from "react";

import { RiFilterLine, RiFilterFill } from "react-icons/ri";
import { useProjectStore } from "@/stores/projectStore";
import { MdError } from "react-icons/md";
import useLogs from "@/hooks/useLogs";
import LogCard from "@/components/project/LogCard";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Pager from "@/components/Pager";

export default function Exceptions() {
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const project = useProjectStore((state) => state.currentProject);
  const exceptions = useLogs({ type: "exceptions", page });
  const exceptionsLoading = useProjectStore((state) => state.exceptionsLoading);

  const totalPages = Math.ceil(exceptions.data?.data?.exceptionsLength / 10);

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
          {!exceptionsLoading && (
            <div className="flex flex-col items-start gap-4 p-4 pb-0">
              <Button
                className="px-2"
                size="h-8"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                {filtersOpen ? <RiFilterFill /> : <RiFilterLine />}
                Filters
              </Button>
              {filtersOpen && (
                <Select
                  options={[
                    { id: "asc", text: "Ascending" },
                    { id: "desc", text: "Descending" },
                  ]}
                  onChange={(event) => {}}
                  className="h-8"
                />
              )}
              {!exceptionsLoading && totalPages > 10 && (
                <Pager
                  currentPage={page}
                  totalPages={totalPages}
                  perPage={2}
                  onPageClick={(page) => setPage(page)}
                  onPreviousClick={() => page != 0 && setPage(page - 1)}
                  onNextClick={() => page + 1 < totalPages && setPage(page + 1)}
                />
              )}
            </div>
          )}
          <div className="flex flex-col gap-2 p-4">
            {exceptionsLoading &&
              Array.from(Array(3)).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-neutral-100 dark:bg-neutral-900 py-20 px-10"
                ></div>
              ))}
            {!exceptionsLoading &&
              exceptions.data?.data?.exceptions?.length == 0 && (
                <div>No exceptions found.</div>
              )}
            {!exceptionsLoading &&
              project &&
              Array.isArray(exceptions.data?.data?.exceptions) &&
              exceptions.data?.data?.exceptions &&
              exceptions.data?.data?.exceptions.length > 0 &&
              exceptions.data?.data?.exceptions.map((exception: any) => {
                return <LogCard log={exception} key={exception._id} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
