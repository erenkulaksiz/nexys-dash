import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";

import { MdClose, MdSearch, MdCheck } from "react-icons/md";
import hookRequest from "@/utils/api/hookRequest";
import { useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import View from "@/components/View";
import Loading from "@/components/Loading";
import useClickAway from "@/hooks/useClickAway";
import KeyboardKey from "@/components/KeyboardKey";
import type {
  InputFilterProps,
  currentAvailableFiltersTypes,
} from "./InputFilter.types";
import { BuildComponent } from "@/utils/style";

const possibleFilters = ["from:", "path:", "action:"];

export default function InputFilter({
  filters,
  setFilters,
  type,
}: InputFilterProps) {
  const [filterText, setFilterText] = useState<string>("");
  const [currentAvailableFilters, setCurrentAvailableFilters] =
    useState<currentAvailableFiltersTypes>({
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
  const project = useProjectStore((state) => state.currentProject);
  const user = useAuthStore((state) => state.validatedUser);
  const isProjectNew = project?.logUsage === 0;
  const currentAvailableFiltersRef = useRef<HTMLDivElement | null>(null);
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(
    "Enter filter type..."
  );
  useClickAway(currentAvailableFiltersRef, () => {
    setShowAvailableFilters(false);
  });

  useEffect(() => {
    if (possibleFilters.includes(filterText.toLowerCase())) {
      setFilters([
        ...filters,
        {
          value: filterText,
          valueId: filterText.replace(":", ""),
        },
      ]);
      if (filterText == "from:") {
        filterByType("user");
      } else if (filterText == "path:") {
        filterByType("path");
      } else if (filterText == "action:") {
        filterByType("action");
      }
      setFilterText("");
    }
  }, [filterText]);

  function filterByType(type: "user" | "path" | "action") {
    setInputPlaceholder("");
    setCurrentAvailableFilters({
      loading: true,
      items: [],
      type: type,
    });
    getAvailableSelectionOption(`${type}s`).then((selectionOptions) => {
      if (selectionOptions.length == 0)
        return setCurrentAvailableFilters({
          loading: false,
          items: [],
          type: type,
        });
      setCurrentAvailableFilters({
        loading: false,
        items: selectionOptions.map((option: any) => {
          return {
            id: option._id,
            text: `${option._id} (${option?.count})`,
          };
        }),
        type,
      });
      setInputPlaceholder(`Enter ${type}...`);
    });
  }

  async function getAvailableSelectionOption(
    optionType: string
  ): Promise<Array<{ _id: string; count: number }>> {
    const token = Cookies.get("auth");
    const { data } = await hookRequest({
      url: `/v1/dash/project/${project?.name}/filter/${type}/${optionType}`,
      data: {
        uid: user?.uid,
      },
      token: token || "",
    });
    return data?.map((data: any) => {
      return {
        _id: data._id || (optionType == "path" ? "No Path" : "Anonymous"),
        count: data?.count || 0,
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
    <div className="p-4 pb-0 flex items-center gap-2">
      <div className="relative flex flex-row min-h-10 min-w-[300px] items-center border-[1px] border-neutral-200 dark:border-dark-border rounded-lg">
        <div className="p-2 flex items-center border-r-[1px] border-neutral-200 dark:border-dark-border dark:text-dark-accent">
          <MdSearch />
        </div>
        <div className="flex flex-row items-center flex-wrap">
          {filters.map((filter, index: number) => {
            return (
              <div
                key={index}
                className={
                  BuildComponent({
                    name: "Filter Selection",
                    defaultClasses:
                      "ml-1 flex flex-row items-center border-[1px] dark:border-dark-border dark:bg-darker",
                    conditionalClasses: [
                      {
                        true: "rounded-lg",
                        false: "rounded-l-lg",
                      },
                    ],
                    selectedClasses: [!!filter?.selection],
                  }).classes
                }
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
                    setInputPlaceholder("Enter filter type...");
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
              placeholder={inputPlaceholder}
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
                  setInputPlaceholder("Enter filter type...");
                }
                if (e.key == "Tab" || e.key == "Enter") {
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
                  } else if (
                    currentAvailableFilters.type == "user" ||
                    currentAvailableFilters.type == "path" ||
                    currentAvailableFilters.type == "action"
                  ) {
                    const newFilters = [...filters];
                    const selectionText = currentAvailableFilters.items.filter(
                      (item: any) => {
                        return item.text
                          .toLowerCase()
                          .includes(filterText.toLowerCase());
                      }
                    )[0].text;
                    newFilters[newFilters.length - 1].selection = selectionText;
                    newFilters[newFilters.length - 1].selectionId =
                      selectionText
                        .replace("(", "")
                        .replace(")", "")
                        .split(" ")[0];
                    setFilters([...newFilters]);
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
                    setInputPlaceholder("Enter filter type...");
                  }
                }
              }}
              onFocus={() => setShowAvailableFilters(true)}
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
                className="absolute max-h-[200px] overflow-auto top-[calc(100%+10px)] left-0 z-20 rounded-lg dark:bg-dark bg-white border-[1px] border-neutral-200 dark:border-dark-border "
              >
                {currentAvailableFiltered.length ? (
                  currentAvailableFiltered.map((item, index: number) => {
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
                            currentAvailableFilters.type == "path" ||
                            currentAvailableFilters.type == "action"
                          ) {
                            const newFilters = [...filters];
                            newFilters[newFilters.length - 1].selection =
                              item.text;
                            newFilters[newFilters.length - 1].selectionId =
                              item.text
                                .replace("(", "")
                                .replace(")", "")
                                .split(" ")[0];
                            setFilters([...newFilters]);
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
                            setInputPlaceholder("Enter filter type...");
                          }
                        }}
                        className="flex flex-row items-center gap-1 text-left whitespace-nowrap px-2 py-1 outline-none border-none dark:hover:bg-darker/50 hover:bg-neutral-200 w-full"
                      >
                        <View.If visible={index == 0}>
                          <KeyboardKey icon={""} _key="TAB" />
                        </View.If>
                        <span>{item.text}</span>
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
