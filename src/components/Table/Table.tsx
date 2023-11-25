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
      "flex flex-col overflow-auto w-full border border-neutral-200 dark:border-neutral-900 p-4",
    extraClasses: containerClassName,
  });

  return (
    <div className={BuildTable.classes}>
      <div className="flex flex-row w-full pb-2 border-b-[1px] border-neutral-200 dark:border-neutral-900">
        {columns.map((column) => (
          <div key={column} className="flex w-full font-bold">
            {column}
          </div>
        ))}
      </div>
      <div className="flex flex-col w-full pt-2">
        {data?.map((row: any) => (
          <div key={row.uid} className="flex flex-row">
            {columns.map((column) => (
              <div key={row[column]} className="flex w-full">
                {row[column]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
