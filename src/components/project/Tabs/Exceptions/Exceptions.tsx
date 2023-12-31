import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { useProjectStore } from "@/stores/projectStore";
import { MdError } from "react-icons/md";
import useLogs from "@/hooks/useLogs";
import LogCard from "@/components/project/LogCard";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import Input from "@/components/Input";
import Tooltip from "@/components/Tooltip";
import CurrentCountText from "@/components/project/CurrentCountText";
import View from "@/components/View";
import { Log, server } from "@/utils";
import { LIMITS } from "@/constants";
import { FaSearch } from "react-icons/fa";
import Select from "@/components/Select";
import hookRequest from "@/utils/api/hookRequest";
import { MdOutlineArrowForwardIos, MdClose } from "react-icons/md";
import { useAuthStore } from "@/stores/authStore";

const filterPoss = [
  {
    value: "from",
    text: "from:",
    desc: "Filter by user who created the exception",
    selections: [
      {
        id: "erenkulaksz@gmail.com",
        text: "erenkulaksz@gmail.com",
        value: 100,
      },
      {
        id: "test",
        text: "test",
        value: 0,
      },
    ],
    selectionOpen: false,
    selectionPlaceholder: "mike@gmail.com",
  },
  {
    value: "path",
    text: "path:",
    desc: "Filter by path",
    selections: [
      {
        id: "/",
        text: "/",
      },
      {
        id: "/about",
        text: "/about",
      },
    ],
    selectionOpen: false,
    selectionPlaceholder: "/shop/cart/checkout",
  },
];

export default function Exceptions() {
  const [page, setPage] = useState<number>(0);
  const project = useProjectStore((state) => state.currentProject);
  const user = useAuthStore((state) => state.validatedUser);
  const [filters, setFilters] = useState<any>([]);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const exceptions = useLogs({
    type: "exceptions",
    page,
    filters: {
      path: "all",
      batchVersion: "all",
      asc: false,
      types: [],
      configUser: "all",
      search: "",
    },
  });

  const exceptionsLoading = useProjectStore((state) => state.exceptionsLoading);
  const totalPages = Math.ceil(exceptions.data?.data?.exceptionsLength / 10);

  async function addFilter(filter: any) {
    if (filter.value == "from") {
      const token = Cookies.get("auth");
      const users = await hookRequest({
        url: `/v1/dash/project/${project?.name}/filter/exceptions/users`,
        data: {
          uid: user?.uid,
        },
        token: token || "",
      });
      filter.selections = users.data?.map((user: any) => {
        return {
          id: user._id,
          text: user._id,
          value: user.count,
        };
      });
    }
    setFilters([...filters, filter]);
    setFiltersOpen(false);
  }

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
          <View.If hidden={exceptionsLoading}>
            <div className="flex flex-col items-start gap-2 p-4 pb-0">
              <div className="flex flex-row gap-1 min-h-8 relative">
                <View.If visible={filters.length > 0}>
                  <div className="flex flex-wrap gap-1 items-center outline-none rounded-lg focus:outline-2 focus:outline-blue-500/50 dborder-[1px] border-neutral-200 dark:border-neutral-900 dark:bg-black placeholder:text-neutral-400 placeholder:text-sm">
                    {filters.map((filter: any, index: number) => (
                      <div
                        className="flex flex-row items-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-md p-1 pr-2 text-sm"
                        key={`${filter.value}${index}`}
                      >
                        <span
                          className="cursor-pointer"
                          onClick={() =>
                            setFilters(
                              filters.filter((_: any, i: number) => i != index)
                            )
                          }
                        >
                          <MdClose />
                        </span>
                        <span>{filter.text}</span>
                        <div className="relative flex">
                          <input
                            type="text"
                            placeholder={filter.selectionPlaceholder}
                            className="h-8 px-2 rounded-lg"
                            onFocus={() => {
                              setFiltersOpen(false);
                              filters[index].selectionOpen = true;
                              setFilters([...filters]);
                            }}
                          />
                          <View.If visible={filter.selectionOpen}>
                            <div className="absolute top-[calc(100%+10px)] p-2 z-[999] bg-black w-full">
                              {filter.selections?.map((selection: any) => (
                                <div className="flex flex-col w-full break-keep text-xs">
                                  <div>{selection.text}</div>
                                  <div>{selection.value}</div>
                                </div>
                              ))}
                            </div>
                          </View.If>
                        </div>
                      </div>
                    ))}
                  </div>
                </View.If>
                <View.If visible={filtersOpen}>
                  <div className="flex flex-col min-w-[200px] items-start gap-1 absolute left-0 right-[50%] top-[calc(100%+8px)] dark:bg-black bg-white border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg z-50 p-2">
                    <div>Filters</div>
                    <div className="flex flex-col gap-1">
                      {filterPoss.map((filter, index) => (
                        <Tooltip
                          content={filter.desc}
                          key={`${filter.value}${index}filters`}
                        >
                          <button
                            onClick={() => addFilter(filter)}
                            className="px-2 border-[1px] border-neutral-200 dark:border-neutral-900 hover:dark:border-neutral-800 rounded-lg"
                          >
                            {filter.text}
                          </button>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </View.If>
                <Tooltip
                  content={filtersOpen ? "Close Filters" : "Open Filters"}
                >
                  <div className="h-full">
                    <Button
                      className="w-16"
                      size="h-8"
                      onClick={() => setFiltersOpen(!filtersOpen)}
                    >
                      <MdOutlineArrowForwardIos
                        style={{
                          transform: filtersOpen
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </Button>
                  </div>
                </Tooltip>
              </div>
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
                return <LogCard log={exception} key={exception._id.$oid} />;
              })}
            </View.If>
          </div>
        </div>
      </div>
    </div>
  );
}
