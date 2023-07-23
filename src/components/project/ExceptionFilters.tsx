import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import View from "@/components/View";
import { BsSortDownAlt, BsSortDown } from "react-icons/bs";

export interface ExceptionFiltersProps {
  asc?: boolean;
  types?: string[];
  batchVersion?: string;
  batchVersions?: any;
  filters?: any;
  setFilters?: any;
  path?: string;
  exceptionPaths?: any;
  exceptionTypes?: any;
  onPathChange?: (path: string) => void;
  onBatchVersionChange?: (version: string) => void;
}

export default function ExceptionFilters({
  exceptionPaths,
  exceptionTypes,
  filters,
  setFilters,
  onPathChange,
  onBatchVersionChange,
  batchVersion,
  batchVersions,
  path,
}: ExceptionFiltersProps) {
  const _batchVersions = Array.isArray(batchVersions)
    ? batchVersions
        ?.filter((el: any) => el.count > 0)
        .map((el: any) => {
          const errors =
            el["AUTO:ERROR"] + el["AUTO:UNHANDLEDREJECTION"] + el["ERROR"];
          return { id: el._id, text: `${el._id} - ${errors}` };
        })
    : [];

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
                checked={filters?.types?.includes(exceptionType._id)}
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
                      types: [...filters.types, exceptionType._id],
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
              return { id: el._id, text: `${el._id} - ${el.count}` };
            }),
        ]}
        onChange={(e) =>
          typeof onPathChange == "function" && onPathChange(e.target.value)
        }
        className="h-8"
        value={path}
        id="select-path"
      />
      <Select
        options={[{ id: "all", text: "All Versions" }, ..._batchVersions]}
        onChange={(e) =>
          typeof onBatchVersionChange == "function" &&
          onBatchVersionChange(e.target.value)
        }
        className="h-8"
        value={batchVersion}
        id="select-version"
      />
    </div>
  );
}
