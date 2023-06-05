import { useEffect, useState } from "react";

import { MdSearch } from "react-icons/md";
import { RiFilterLine, RiFilterFill } from "react-icons/ri";
import { useProjectStore } from "@/stores/projectStore";
import { MdError } from "react-icons/md";
import useLogs from "@/hooks/useLogs";
import LogCard from "@/components/project/LogCard";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Pager from "@/components/Pager";
import Checkbox from "@/components/Checkbox";
import Filters from "@/components/project/Filters";
import useDebounce from "@/hooks/useDebounce";
import Input from "@/components/Input/Input";
import View from "@/components/View";
import { Log } from "@/utils";
import type { FiltersProps } from "@/components/project/Filters";

export default function Exceptions() {
  const [filteredText, setFilteredText] = useState<string>("");
  const [debouncedFilteredText, setDebouncedFilteredText] =
    useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersProps>({
    asc: false,
    types: [],
  });
  const [page, setPage] = useState<number>(0);
  const project = useProjectStore((state) => state.currentProject);
  const exceptions = useLogs({
    type: "exceptions",
    page,
    asc: filters.asc,
    types: filters.types,
    search: debouncedFilteredText,
  });
  const exceptionTypes: any = exceptions.data?.data?.exceptionTypes
    .sort((a: any, b: any) => a.count - b.count)
    .map((type: any) => type._id);

  const exceptionsLoading = useProjectStore((state) => state.exceptionsLoading);
  const totalPages = Math.ceil(exceptions.data?.data?.exceptionsLength / 10);

  useEffect(() => {
    setPage(0);
    exceptions.mutate();
  }, [filters]);

  useDebounce(
    () => {
      setDebouncedFilteredText(filteredText);
    },
    [filteredText],
    800
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
            <View.If
              visible={
                !exceptionsLoading &&
                exceptions.data?.data?.exceptionsLength != 0
              }
            >
              <div className="text-sm">
                Currently showing{" "}
                <span className="ml-1 text-xs whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-1 rounded-full">
                  {exceptions.data?.data?.exceptionsLength}
                </span>{" "}
                exceptions.
              </div>
            </View.If>
          </div>
          <View.If hidden={exceptionsLoading}>
            <div className="flex flex-col items-start gap-4 p-4 pb-0">
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
                <div className="flex flex-row gap-2 flex-wrap w-full items-center">
                  {/*<Input
                    height="h-8"
                    icon={<MdSearch />}
                    placeholder="Search"
                    value={filteredText}
                    onChange={(event) => setFilteredText(event.target.value)}
            />*/}
                  <Select
                    options={[
                      { id: "asc", text: "Ascending" },
                      { id: "desc", text: "Descending" },
                    ]}
                    onChange={(event) =>
                      setFilters({
                        ...filters,
                        asc: event.target.value == "asc",
                      })
                    }
                    className="h-8"
                    value={filters.asc ? "asc" : "desc"}
                    id="select-asc-desc"
                  />
                  <View.If visible={!!exceptionTypes?.length}>
                    <div className="flex flex-row flex-wrap border-[1px] border-neutral-200 dark:border-neutral-900 p-1 px-2 gap-2 rounded-lg">
                      {exceptionTypes?.map(
                        (exceptionType: any, index: number) => (
                          <Checkbox
                            checked={filters?.types?.includes(exceptionType)}
                            onChange={() => {
                              if (filters?.types?.includes(exceptionType)) {
                                setFilters({
                                  ...filters,
                                  types: filters.types.filter(
                                    (type) => type != exceptionType
                                  ),
                                });
                              } else {
                                setFilters({
                                  ...filters,
                                  types: [...filters.types, exceptionType],
                                });
                              }
                            }}
                            id={`checkbox-filter-${exceptionType}`}
                            key={`checkbox-filter-${exceptionType}`}
                          >
                            <span>{exceptionType}</span>
                            <span className="ml-1 text-xs whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-1 rounded-full">
                              {
                                exceptions.data?.data?.exceptionTypes[index]
                                  ?.count
                              }
                            </span>
                          </Checkbox>
                        )
                      )}
                    </div>
                  </View.If>
                </div>
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
