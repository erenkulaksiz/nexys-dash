import Link from "next/link";
import { useMemo } from "react";

import { MdOutlineAccessTime, MdPerson } from "react-icons/md";
import { Log, formatDateToHuman } from "@/utils";
import { BuildComponent } from "@/utils/style";
import { TbListDetails } from "react-icons/tb";
import { useProjectStore } from "@/stores/projectStore";
import Button from "@/components/Button";

export default function BatchCard({ batch }: { batch: any }) {
  const project = useProjectStore((state) => state.currentProject);

  const batches = useMemo(
    () =>
      batch?.data?.logs?.reduce((acc: any, log: any) => {
        if (!acc[log?.options?.type]) {
          acc[log?.options?.type] = [];
        }
        acc[log?.options?.type].push(log);
        return acc;
      }, {}),
    [batch?.data?.logs]
  );

  const batchTypeLengths = useMemo(
    () =>
      Object.keys(batches).map((key) => {
        return {
          type: key,
          length: batches[key].length,
        };
      }),
    [batches]
  );

  return (
    <div className="flex flex-col border-[1px] rounded-lg p-3 border-neutral-200 dark:border-neutral-900">
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center text-neutral-500 text-sm">
            <div>
              <MdOutlineAccessTime />
            </div>
            <span>
              {batch?.ts || batch?.createdAt
                ? formatDateToHuman({
                    date: batch?.ts ? batch?.ts : batch?.createdAt,
                    output:
                      "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
                  })
                : "-"}
            </span>
          </div>
          <Link
            href={`/project/${project ? project.name : ""}/batch/${batch._id}`}
          >
            <Button
              light="dark:bg-white bg-black dark:text-black"
              className="px-4  text-white"
            >
              <TbListDetails />
              <span className="ml-1">View Batch</span>
            </Button>
          </Link>
        </div>
        {batch?.data?.config?.user && (
          <div className="flex flex-row gap-1 text-sm text-neutral-500 items-center">
            <MdPerson />
            <span>{`User: ${batch?.data?.config?.user}`}</span>
          </div>
        )}
        <div className="flex flex-row items-center gap-2">
          <ul className="flex flex-row gap-2 items-center">
            {batchTypeLengths
              .sort((a, b) => (a.type == "undefined" ? 1 : -1))
              .map((batchTypeLength) => {
                return (
                  <li
                    key={`logBatch${batchTypeLength.type}`}
                    className={
                      BuildComponent({
                        defaultClasses:
                          "flex flex-row gap-2 items-center border-[1px] px-1 rounded",
                        conditionalClasses: [
                          {
                            true: "border-red-400 dark:border-red-800",
                            false: "border-neutral-200 dark:border-neutral-900",
                          },
                        ],
                        selectedClasses: [
                          batchTypeLength.type == "ERROR" ||
                            batchTypeLength.type == "AUTO:ERROR" ||
                            batchTypeLength.type == "AUTO:UNHANDLEDREJECTION",
                        ],
                      }).classes
                    }
                  >
                    <div className="flex flex-row gap-[2px] items-center">
                      <span className="text-sm">
                        {batchTypeLength.type != "undefined"
                          ? batchTypeLength.type
                          : "Others"}
                      </span>
                      <span className="text-neutral-500 text-xs">
                        ({batchTypeLength.length})
                      </span>
                    </div>
                  </li>
                );
              })}

            <li className="flex flex-row gap-2 items-center border-[1px] px-1 rounded border-neutral-200 dark:border-neutral-900">
              <div className="flex flex-row gap-[2px] items-center">
                <span className="text-sm">Total</span>
                <span className="text-neutral-500 text-xs">
                  ({batch?.data?.logs?.length})
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
