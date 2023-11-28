import { BuildComponent } from "@/utils/style";
import type { TableProps } from "./Table.types";

export default function Table({
  data,
  columns,
  containerClassName,
}: TableProps) {
  const BuildTable = BuildComponent({
    name: "Table",
    defaultClasses:
      "flex flex-col overflow-auto p-4 border border-neutral-200 dark:border-neutral-900",
    extraClasses: containerClassName,
  });

  return (
    <div className={BuildTable.classes}>
      <div className="flex flex-row min-w-max border-b pb-2 border-neutral-200 dark:border-neutral-900">
        {columns.map((column) => (
          <div key={column} className="flex font-bold min-w-[280px]">
            {column}
          </div>
        ))}
      </div>
      <div className="flex flex-col min-w-max pt-2">
        {data?.map((row: any) => (
          <div key={row.uid} className="flex flex-row">
            {columns.map((column) => (
              <div key={row[column]} className="flex min-w-[280px]">
                {row[column]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
