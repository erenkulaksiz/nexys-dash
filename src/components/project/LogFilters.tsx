import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import View from "@/components/View";
import { Log } from "@/utils";
import { BsSortDownAlt, BsSortDown } from "react-icons/bs";

export interface LogFiltersProps {
  asc?: boolean;
  path?: string;
  action?: string;
  filters?: any;
  setFilters?: any;
  logPaths?: any;
  logActions?: any;
}

export default function LogFilters({
  filters,
  setFilters,
  logPaths,
  logActions,
}: LogFiltersProps) {
  return (
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
      <Select
        options={[
          { id: "all", text: "All Paths" },
          ...logPaths
            ?.filter((el: any) => el.count > 0)
            .map((el: any) => {
              return { id: el._id, text: `${el._id} - ${el.count} logs` };
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
        options={[
          { id: "all", text: "All Actions" },
          ...logActions
            ?.filter((el: any) => el.count > 0)
            .map((el: any) => {
              return { id: el._id, text: `${el._id} - ${el.count} logs` };
            }),
        ]}
        onChange={(e) => {
          setFilters({
            ...filters,
            action: e.target.value,
          });
        }}
        className="h-8"
        value={filters.action}
        id="select-action"
      />
    </div>
  );
}
