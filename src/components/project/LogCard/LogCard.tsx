import Link from "next/link";
import { MdOutlineError, MdOutlineAccessTime } from "react-icons/md";
import { RiStackLine } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import JSONPretty from "react-json-pretty";
import { FaDotCircle } from "react-icons/fa";

import Button from "@/components/Button";
import Codeblock from "@/components/Codeblock";
import Tooltip from "@/components/Tooltip/Tooltip";
import { formatDateToHuman } from "@/utils";
import { BuildComponent } from "@/utils/style";
import { useProjectStore } from "@/stores/projectStore";

export default function LogCard({
  log,
  data,
  viewingBatch,
  logSelected = false,
}: any) {
  const project = useProjectStore((state) => state.currentProject);

  const isTypeError =
    log?.options?.type === "AUTO:ERROR" ||
    log?.options?.type === "AUTO:UNHANDLEDREJECTION" ||
    log?.options?.type === "ERROR";

  const isJson = typeof log?.data === "object";

  return (
    <div
      className={
        BuildComponent({
          defaultClasses: "relative flex flex-col border-[1px] rounded-lg p-3",
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
      {/*<div className="absolute -right-2 -top-2 text-black dark:text-white">
        <Tooltip content="Unread">
          <FaDotCircle size={24} />
        </Tooltip>
    </div>*/}
      {logSelected && (
        <div className="absolute -inset-1 ring-2 ring-yellow-400 dark:ring-yellow-700 rounded-xl"></div>
      )}
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center text-neutral-500 text-sm">
            <div>
              <MdOutlineAccessTime />
            </div>
            <span>
              {formatDateToHuman({
                date: log?.ts,
                output: "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
              })}
            </span>
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
                  data._id
                }?logGuid=${log.guid}`}
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
            {!log?.data?.message && log?.data && !isJson && (
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
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row gap-1 items-center">
              <div>Type</div>
            </div>
            <div>
              <span className="text-xs whitespace-pre-wrap dark:text-neutral-400 text-neutral-600">
                {log?.options?.type}
              </span>
            </div>
          </div>
        )}
        {data?.env?.type && (
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row gap-1 items-center">
              <div>Environment</div>
            </div>
            <div>
              <span className="text-xs whitespace-pre-wrap dark:text-neutral-400 text-neutral-600">
                {data?.env?.type}
              </span>
            </div>
          </div>
        )}
        {data?.env?.ver && (
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row gap-1 items-center">
              <div>Platform</div>
            </div>
            <div>
              <span className="text-xs whitespace-pre-wrap dark:text-neutral-400 text-neutral-600">
                NextJS
              </span>
            </div>
          </div>
        )}
        {log?.path && (
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row gap-1 items-center">
              <div>Path</div>
            </div>
            <div>
              <span className="text-xs whitespace-pre-wrap dark:text-neutral-400 text-neutral-600">
                {log?.path}
              </span>
            </div>
          </div>
        )}
        {log?.data?.filename && (
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row gap-1 items-center">
              <div>File</div>
            </div>
            <div>
              <span className="text-xs whitespace-pre-wrap dark:text-neutral-400 text-neutral-600">
                {log?.data?.filename}
              </span>
            </div>
          </div>
        )}
        {log?.guid && (
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-row gap-1 items-center">
              <div>GUID</div>
            </div>
            <div>
              <span className="text-xs whitespace-pre-wrap dark:text-neutral-400 text-neutral-600">
                {log?.guid}
              </span>
            </div>
          </div>
        )}
        {log?.data?.stack && (
          <>
            <div className="flex flex-row gap-1 items-center">
              <RiStackLine size={18} />
              <div>Stack Trace</div>
            </div>
            <Codeblock data={log?.data?.stack}>
              <span className="text-xs whitespace-pre-wrap text-neutral-400">
                {log?.data?.stack}
              </span>
            </Codeblock>
          </>
        )}
      </div>
    </div>
  );
}
