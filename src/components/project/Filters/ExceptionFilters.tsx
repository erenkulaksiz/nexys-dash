import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import View from "@/components/View";
import Input from "@/components/Input";
import Tooltip from "@/components/Tooltip";
import { BsSortDownAlt, BsSortDown } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { LIMITS } from "@/constants";
import { MdInfoOutline } from "react-icons/md";
import type { LogFilterTypes } from "@/types";

interface LogFiltersProps {
  exceptions: any;
  filters: LogFilterTypes;
  setFilters: (filters: LogFilterTypes) => void;
  onSearchTextChange?: (text: string) => void;
  search: string;
}

export default function ExceptionFilters({
  exceptions,
  filters,
  setFilters,
  onSearchTextChange,
  search,
}: LogFiltersProps) {
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

  const _batchVersions = Array.isArray(batchVersions)
    ? batchVersions
        ?.filter((el: any) => el.count > 0)
        .map((el: any) => {
          return { id: el._id, text: `${el._id} - ${el.count} errors` };
        })
    : [];

  const _configUsers = configUsers.map((el: any) => {
    return { id: el._id, text: `${el._id} - ${el.count} logs` };
  });

  return (
    <div className="flex flex-row gap-2 flex-wrap w-full items-start">
      <div className="flex flex-row gap-2 items-center">
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
        <View viewIf={filters.asc}>
          <View.If>
            <BsSortDown />
          </View.If>
          <View.Else>
            <BsSortDownAlt />
          </View.Else>
        </View>
      </div>
      <View.If visible={!!exceptionTypes?.length && exceptionTypes.length != 1}>
        <div className="flex flex-row flex-wrap border-[1px] border-neutral-200 dark:border-neutral-900 p-1 px-2 gap-2 rounded-lg">
          {exceptionTypes?.map(
            (exceptionType: { _id: string; count: number }) => (
              <Checkbox
                checked={
                  !filters?.types
                    ? false
                    : filters?.types?.includes(exceptionType._id)
                }
                onChange={() => {
                  if (filters?.types?.includes(exceptionType._id)) {
                    setFilters({
                      ...filters,
                      types: filters.types.filter(
                        (type: any) => type != exceptionType._id
                      ),
                    });
                  } else {
                    setFilters({
                      ...filters,
                      types: [...(filters.types || []), exceptionType._id],
                    });
                  }
                }}
                id={`checkbox-filter-${exceptionType._id}`}
                key={`checkbox-filter-${exceptionType._id}`}
              >
                <span className="mr-1 text-xs whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-1 rounded-full">
                  {exceptionType.count}
                </span>
                <span>{exceptionType._id}</span>
              </Checkbox>
            )
          )}
        </div>
      </View.If>
      <Select
        options={[
          { id: "all", text: "All Paths" },
          ...exceptionPaths
            ?.filter((el: any) => el.count > 0)
            .map((el: any) => {
              return { id: el._id, text: `${el._id} - ${el.count} errors` };
            }),
        ]}
        onChange={(e) => {
          setFilters({
            ...filters,
            path: e.target.value,
          });
        }}
        className="h-8"
        value={filters.path}
        id="select-path"
      />
      <Select
        options={[{ id: "all", text: "All Versions" }, ..._batchVersions]}
        onChange={(e) => {
          setFilters({
            ...filters,
            batchVersion: e.target.value,
          });
        }}
        className="h-8"
        value={filters.batchVersion}
        id="select-version"
      />
      <Select
        options={[{ id: "all", text: "All Users" }, ..._configUsers]}
        onChange={(e) => {
          setFilters({
            ...filters,
            configUser: e.target.value,
          });
        }}
        className="h-8"
        value={filters.configUser}
        id="select-user"
      />
      <div className="flex flex-row gap-2">
        <Input
          icon={<FaSearch />}
          placeholder="Search"
          onChange={(e) => {
            typeof onSearchTextChange == "function" &&
              onSearchTextChange(e.target.value);
          }}
          value={search}
          containerClassName="h-8"
          maxLength={LIMITS.MAX.PROJECT_LOG_SEARCH_TEXT_LENGTH}
        />
        <Tooltip outline content="Text search works on log path and messages.">
          <MdInfoOutline size={14} />
        </Tooltip>
      </div>
    </div>
  );
}
