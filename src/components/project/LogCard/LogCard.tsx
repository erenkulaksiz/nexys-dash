import Link from "next/link";
import { MdOutlineError, MdOutlineAccessTime } from "react-icons/md";
import { RiStackLine } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import JSONPretty from "react-json-pretty";

import Button from "@/components/Button";
import Codeblock from "@/components/Codeblock";
import { Log, formatDateToHuman } from "@/utils";
import { BuildComponent } from "@/utils/style";
import { useProjectStore } from "@/stores/projectStore";
import type { LogCardProps } from "./LogCard.types";

function LogCardEntry({
  title,
  value,
}: {
  title: string;
  value: string | number | boolean;
}) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-row gap-1 items-center">
        <div>{title}</div>
      </div>
      <div>
        <span className="text-xs whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-1 rounded-full">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function LogCard({
  log,
  viewingBatch,
  logSelected = false,
}: LogCardProps) {
  const project = useProjectStore((state) => state.currentProject);

  const isTypeError =
    log?.options?.type === "AUTO:ERROR" ||
    log?.options?.type === "AUTO:UNHANDLEDREJECTION" ||
    log?.options?.type === "ERROR";

  const isJson =
    typeof log?.data === "object" && Object.keys(log?.data).length > 0;
  const isEmptyObject =
    typeof log?.data === "object" && Object.keys(log?.data).length === 0;

  return (
    <div
      className={
        BuildComponent({
          defaultClasses:
            "relative flex flex-col border-[1px] rounded-lg p-3 align-start",
          conditionalClasses: [
            {
              true: "border-red-400 dark:border-red-700",
              false: "border-neutral-200 dark:border-neutral-900",
            },
          ],
          selectedClasses: [isTypeError],
        }).classes
      }
    >
      {/*
      <div className="absolute -right-2 -top-2 text-black dark:text-white">
        <Tooltip content="Unread">
          <FaDotCircle size={24} />
        </Tooltip>
      </div>
      */}
      {logSelected && (
        <div className="absolute -inset-1 ring-2 ring-yellow-400 dark:ring-yellow-700 rounded-xl -z-10"></div>
      )}
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center sm:gap-0 gap-2">
          <div className="flex flex-row gap-2 items-center text-neutral-500 text-sm">
            <div className="text-sm">LOG</div>
            <div>
              <MdOutlineAccessTime />
            </div>
            <time dateTime={log?.ts}>
              {formatDateToHuman({
                date: log?.ts,
                output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
              })}
            </time>
          </div>
          <div className="flex flex-row gap-2">
            {/*
              <Button light className="px-4" onClick={() => {}}>
                <MdOutlineRemove />
                <span className="ml-1">Ignore</span>
              </Button>
            */}
            {!viewingBatch && (
              <Link
                href={`/project/${project?.name ? project.name : ""}/batch/${
                  log.batchId
                }?log=${log._id}`}
              >
                <Button
                  light="dark:bg-white bg-black dark:text-black"
                  className="px-4  text-white"
                >
                  <TbListDetails />
                  <span className="ml-1">View Batch</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between pb-2 border-b-[1px] border-neutral-200 dark:border-neutral-900">
          <div className="flex flex-row gap-1 items-center w-full">
            {isTypeError && (
              <MdOutlineError size={24} className="fill-red-700" />
            )}
            {log?.data?.message && (
              <div className="text-sm w-full break-all">
                {log?.data?.message}
              </div>
            )}
            {!log?.data?.message && log?.data && !isJson && !isEmptyObject && (
              <div className="text-sm w-full break-all">{log?.data}</div>
            )}
            {!log?.data?.message && log?.data && isJson && (
              <Codeblock data={log?.data}>
                <JSONPretty
                  id="json-pretty"
                  data={log?.data}
                  className="text-sm"
                ></JSONPretty>
              </Codeblock>
            )}
          </div>
        </div>
        {log?.options?.type && (
          <LogCardEntry title="Type" value={log?.options?.type} />
        )}
        {log?.env?.type && (
          <LogCardEntry title="Environment" value={log?.env?.type} />
        )}
        {log?.env?.ver && <LogCardEntry title="Platform" value="NextJS" />}
        {log?.path && <LogCardEntry title="Path" value={log?.path} />}
        {log?.options?.action && (
          <LogCardEntry title="Action" value={log?.options?.action} />
        )}
        {log?.data?.filename && (
          <LogCardEntry title="File" value={log?.data?.filename} />
        )}
        {log?.guid && <LogCardEntry title="GUID" value={log?.guid} />}
        {log._id && <LogCardEntry title="ID" value={log._id} />}
        {log?.data?.stack && (
          <LogCardEntry title="Stack Trace" value={log?.data?.stack} />
        )}
      </div>
    </div>
  );
}
