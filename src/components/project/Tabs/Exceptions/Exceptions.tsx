import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

import { useProjectStore } from "@/stores/projectStore";
import { MdError } from "react-icons/md";
import useLogs from "@/hooks/useLogs";
import LogCard from "@/components/project/LogCard";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Pager from "@/components/Pager";
import Tooltip from "@/components/Tooltip";
import CurrentCountText from "@/components/project/CurrentCountText";
import View from "@/components/View";
import hookRequest from "@/utils/api/hookRequest";
import { MdOutlineArrowForwardIos, MdClose, MdSearch } from "react-icons/md";
import { useAuthStore } from "@/stores/authStore";

const possibleFilters = ["from:", "path:"];

export default function Exceptions() {
  const [page, setPage] = useState<number>(0);
  const project = useProjectStore((state) => state.currentProject);
  const user = useAuthStore((state) => state.validatedUser);
  const [filters, setFilters] = useState<any>([]);
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

  const [filterText, setFilterText] = useState<string>("");
  const [currentAvailableFilters, setCurrentAvailableFilters] = useState<any>({
    loading: false,
    items: possibleFilters.map((filter) => {
      return {
        id: filter,
        text: filter,
      };
    }),
    type: "filter",
  });
  const [showAvailableFilters, setShowAvailableFilters] =
    useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (possibleFilters.includes(filterText.toLowerCase())) {
      setFilters([...filters, { value: filterText, selection: "" }]);
      if (filterText == "from:") {
        setCurrentAvailableFilters({
          loading: true,
          items: [],
          type: "user",
        });
        getAvailableUserSelections().then((users) => {
          setCurrentAvailableFilters({
            loading: false,
            items: users.map((user: any) => {
              return {
                id: user._id,
                text: `${user._id} (${user.errorCount})`,
              };
            }),
            type: "user",
          });
        });
      } else if (filterText == "path:") {
        setCurrentAvailableFilters({
          loading: true,
          items: [],
          type: "path",
        });
        getAvailablePathSelections().then((paths) => {
          setCurrentAvailableFilters({
            loading: false,
            items: paths.map((path: any) => {
              return {
                id: path._id,
                text: `${path._id} (${path.errorCount})`,
              };
            }),
            type: "path",
          });
        });
      }
      setFilterText("");
    }
  }, [filterText]);

  const exceptionsLoading = useProjectStore((state) => state.exceptionsLoading);
  const totalPages = Math.ceil(exceptions.data?.data?.exceptionsLength / 10);

  async function getAvailableUserSelections() {
    const token = Cookies.get("auth");
    const users = await hookRequest({
      url: `/v1/dash/project/${project?.name}/filter/exceptions/users`,
      data: {
        uid: user?.uid,
      },
      token: token || "",
    });
    return users?.data?.map((user: any) => {
      return {
        _id: user._id || "Anonymous",
        errorCount: user.errorCount,
      };
    });
  }

  async function getAvailablePathSelections() {
    const token = Cookies.get("auth");
    const paths = await hookRequest({
      url: `/v1/dash/project/${project?.name}/filter/exceptions/paths`,
      data: {
        uid: user?.uid,
      },
      token: token || "",
    });
    return paths?.data?.map((path: any) => {
      return {
        _id: path._id,
        errorCount: path.errorCount,
      };
    });
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
            <div className="p-4 pb-0 flex">
              <div className="relative flex flex-row min-h-10 min-w-[300px] items-center border-[1px] border-neutral-200 dark:border-neutral-900 rounded-xl">
                <div className="p-2 h-full flex items-center border-r-[1px] border-neutral-200 dark:border-neutral-900">
                  <MdSearch />
                </div>
                {filters.map((filter: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="ml-1 flex flex-row items-center bg-neutral-900 rounded-lg"
                    >
                      <div
                        className="p-1 h-full flex items-center cursor-pointer"
                        onClick={() => {
                          const newFilters = [...filters];
                          newFilters.splice(index, 1);
                          setFilters(newFilters);
                          setCurrentAvailableFilters({
                            loading: false,
                            items: possibleFilters.map((filter) => {
                              return {
                                id: filter,
                                text: filter,
                              };
                            }),
                            type: "filter",
                          });
                        }}
                      >
                        <MdClose />
                      </div>
                      <div className="h-full whitespace-nowrap p-1 px-2 pl-0 flex gap-1 items-center">
                        <span>{filter.value}</span>
                        <span>{filter.selection}</span>
                      </div>
                    </div>
                  );
                })}
                <View.If visible={currentAvailableFilters.loading}>
                  <Loading size="lg" className="ml-2" />
                </View.If>
                <div className="relative w-full">
                  <input
                    ref={inputRef}
                    type="text"
                    className="bg-transparent w-full outline-none px-2 break-keep-all overflow-hidden"
                    onChange={(e) => setFilterText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key == "Backspace" && filterText == "") {
                        const newFilters = [...filters];
                        newFilters.pop();
                        setFilters(newFilters);
                        setCurrentAvailableFilters({
                          loading: false,
                          items: possibleFilters.map((filter) => {
                            return {
                              id: filter,
                              text: filter,
                            };
                          }),
                          type: "filter",
                        });
                      }
                      if (
                        (e.key == "Tab" || e.key == "Enter") &&
                        currentAvailableFilters.items.filter((item: any) => {
                          return item.text
                            .toLowerCase()
                            .includes(filterText.toLowerCase());
                        }).length == 1
                      ) {
                        if (currentAvailableFilters.type == "filter") {
                          setFilterText(
                            currentAvailableFilters.items.filter(
                              (item: any) => {
                                return item.text
                                  .toLowerCase()
                                  .includes(filterText.toLowerCase());
                              }
                            )[0].text
                          );
                          setShowAvailableFilters(true);
                          setTimeout(() => inputRef.current?.focus(), 0);
                        } else if (currentAvailableFilters.type == "user") {
                          const newFilters = [...filters];
                          newFilters[newFilters.length - 1].selection =
                            currentAvailableFilters.items.filter(
                              (item: any) => {
                                return item.text
                                  .toLowerCase()
                                  .includes(filterText.toLowerCase());
                              }
                            )[0].text;
                          setShowAvailableFilters(true);
                          setFilterText("");
                          setTimeout(() => inputRef.current?.focus(), 0);
                          setCurrentAvailableFilters({
                            loading: false,
                            items: possibleFilters.map((filter) => {
                              return {
                                id: filter,
                                text: filter,
                              };
                            }),
                            type: "filter",
                          });
                        }
                      }
                    }}
                    onFocus={() => setShowAvailableFilters(true)}
                    //onBlur={() => setShowAvailableFilters(false)}
                    value={filterText}
                  />
                  <View.If
                    visible={
                      currentAvailableFilters.items &&
                      !currentAvailableFilters.loading &&
                      showAvailableFilters
                    }
                  >
                    <div className="absolute max-h-[200px] overflow-auto top-[calc(100%+10px)] left-0 z-20 rounded-xl bg-black border-[1px] border-neutral-200 dark:border-neutral-900 ">
                      {currentAvailableFilters.items
                        .filter((item: any) => {
                          if (!filterText) return true;
                          return item.text
                            .toLowerCase()
                            .includes(filterText.toLowerCase());
                        })
                        .map((item: any) => {
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (currentAvailableFilters.type == "filter") {
                                  setFilterText(item.text);
                                  setShowAvailableFilters(false);
                                  setTimeout(
                                    () => inputRef.current?.focus(),
                                    0
                                  );
                                } else if (
                                  currentAvailableFilters.type == "user"
                                ) {
                                  const newFilters = [...filters];
                                  newFilters[newFilters.length - 1].selection =
                                    item.text;
                                  setShowAvailableFilters(false);
                                  setFilterText("");
                                  setTimeout(
                                    () => inputRef.current?.focus(),
                                    0
                                  );
                                  setCurrentAvailableFilters({
                                    loading: false,
                                    items: possibleFilters.map((filter) => {
                                      return {
                                        id: filter,
                                        text: filter,
                                      };
                                    }),
                                    type: "filter",
                                  });
                                } else if (
                                  currentAvailableFilters.type == "path"
                                ) {
                                  const newFilters = [...filters];
                                  newFilters[newFilters.length - 1].selection =
                                    item.text;
                                  setShowAvailableFilters(false);
                                  setFilterText("");
                                  setTimeout(
                                    () => inputRef.current?.focus(),
                                    0
                                  );
                                  setCurrentAvailableFilters({
                                    loading: false,
                                    items: possibleFilters.map((filter) => {
                                      return {
                                        id: filter,
                                        text: filter,
                                      };
                                    }),
                                    type: "filter",
                                  });
                                }
                              }}
                              className="text-left whitespace-nowrap px-2 py-1 outline-none border-none hover:bg-neutral-800 w-full"
                            >
                              {item.text}
                            </button>
                          );
                        })}
                    </div>
                  </View.If>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 p-4 pb-0">
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
