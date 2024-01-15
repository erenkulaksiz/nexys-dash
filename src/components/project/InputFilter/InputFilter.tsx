import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";

import { MdClose, MdSearch } from "react-icons/md";
import hookRequest from "@/utils/api/hookRequest";
import { useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import View from "@/components/View";
import Loading from "@/components/Loading";
import useClickAway from "@/hooks/useClickAway";
import type { InputFilterProps } from "./InputFilter.types";

const possibleFilters = ["from:", "path:"];

export default function InputFilter() {
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
  const [filters, setFilters] = useState<any>([]);
  const project = useProjectStore((state) => state.currentProject);
  const user = useAuthStore((state) => state.validatedUser);
  const isProjectNew = project?.logUsage === 0;
  const currentAvailableFiltersRef = useRef<HTMLDivElement | null>(null);
  useClickAway(currentAvailableFiltersRef, () => {
    setShowAvailableFilters(false);
  });

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
          if (users.length == 0)
            return setCurrentAvailableFilters({
              loading: false,
              items: [],
              type: "user",
            });
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
          if (paths.length == 0)
            return setCurrentAvailableFilters({
              loading: false,
              items: [],
              type: "path",
            });
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

  if (isProjectNew) return <></>;

  const currentAvailableFiltered = currentAvailableFilters.items.filter(
    (item: any) => {
      if (!filterText) return true;
      return item.text.toLowerCase().includes(filterText.toLowerCase());
    }
  );

  return (
    <div className="p-4 pb-0 flex">
      <div className="relative flex flex-row min-h-10 min-w-[300px] items-center border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg">
        <div className="p-2 h-full flex items-center border-r-[1px] border-neutral-200 dark:border-neutral-900">
          <MdSearch />
        </div>
        <div className="flex flex-row gap-1 items-center flex-wrap py-2">
          {filters.map((filter: any, index: number) => {
            return (
              <div
                key={index}
                className="ml-1 flex flex-row items-center dark:bg-neutral-900 bg-neutral-200 rounded-lg"
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
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              className="bg-transparent outline-none px-2 break-keep-all overflow-hidden"
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
                      currentAvailableFilters.items.filter((item: any) => {
                        return item.text
                          .toLowerCase()
                          .includes(filterText.toLowerCase());
                      })[0].text
                    );
                    setShowAvailableFilters(true);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  } else if (currentAvailableFilters.type == "user") {
                    const newFilters = [...filters];
                    newFilters[newFilters.length - 1].selection =
                      currentAvailableFilters.items.filter((item: any) => {
                        return item.text
                          .toLowerCase()
                          .includes(filterText.toLowerCase());
                      })[0].text;
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
              <div
                ref={currentAvailableFiltersRef}
                className="absolute max-h-[200px] overflow-auto top-[calc(100%+10px)] left-0 z-20 rounded-lg dark:bg-black bg-white border-[1px] border-neutral-200 dark:border-neutral-900 "
              >
                {currentAvailableFiltered.length ? (
                  currentAvailableFiltered.map((item: any) => {
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (currentAvailableFilters.type == "filter") {
                            setFilterText(item.text);
                            setShowAvailableFilters(false);
                            setTimeout(() => inputRef.current?.focus(), 0);
                          } else if (
                            currentAvailableFilters.type == "user" ||
                            currentAvailableFilters.type == "path"
                          ) {
                            const newFilters = [...filters];
                            newFilters[newFilters.length - 1].selection =
                              item.text;
                            setShowAvailableFilters(false);
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
                        }}
                        className="text-left whitespace-nowrap px-2 py-1 outline-none border-none dark:hover:bg-neutral-800 hover:bg-neutral-200 w-full"
                      >
                        {item.text}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-2">No results</div>
                )}
              </div>
            </View.If>
          </div>
        </div>
      </div>
    </div>
  );
}
