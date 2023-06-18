import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";

export interface FiltersProps {
  asc: boolean;
  types: string[];
  filters?: any;
  setFilters?: any;
  path?: string;
}

export default function Filters({ types, filters, setFilters }: FiltersProps) {
  return (
    <div className="flex flex-row gap-2 flex-wrap w-full items-center">
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
      {types &&
        types?.length > 0 &&
        types.map((exceptionType: any, index: number) => (
          <Checkbox
            checked={filters?.types?.includes(exceptionType)}
            onChange={() => {
              if (filters?.types?.includes(exceptionType)) {
                setFilters({
                  ...filters,
                  types: filters.types.filter(
                    (type: any) => type != exceptionType
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
              {/*exceptions.data?.data?.exceptionTypes[index]?.count*/}
            </span>
          </Checkbox>
        ))}
    </div>
  );
}
