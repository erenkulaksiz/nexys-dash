import Link from "next/link";
import { MdOutlineError, MdOutlineAccessTime } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import JSONPretty from "react-json-pretty";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";

import Tooltip from "@/components/Tooltip";
import Button from "@/components/Button";
import Codeblock from "@/components/Codeblock";
import { formatDateToHuman } from "@/utils";
import { BuildComponent } from "@/utils/style";
import View from "@/components/View";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { useProjectStore } from "@/stores/projectStore";
import LogCardEntry from "../LogCardEntry";
import type { LogCardProps } from "./LogCard.types";

export default function LogCard({
  log,
  viewingBatch,
  logSelected = false,
  onAIInsightClick,
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
            "relative flex flex-col border-[1px] rounded-lg p-3 align-start border-neutral-200 dark:border-dark-border",
        }).classes
      }
    >
      <View.If visible={logSelected}>
        <div className="absolute -inset-1 ring-2 ring-yellow-400 dark:ring-yellow-700 rounded-xl -z-10"></div>
      </View.If>
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
            <View.If hidden={viewingBatch}>
              <Link
                href={`/project/${project?.name ? project.name : ""}/batch/${
                  log.batchId?.$oid
                }?log=${log._id?.$oid}`}
              >
                <Button
                  light="dark:bg-dark-text bg-black dark:text-black"
                  className="px-4 text-white"
                >
                  <TbListDetails />
                  <span className="ml-1">View Batch</span>
                </Button>
              </Link>
            </View.If>
            <View.If visible={isTypeError}>
              <Tooltip content="AI Feature will be available soon.">
                <Button
                  light="dark:bg-dark-text bg-black dark:text-black"
                  className="px-4 text-white"
                  onClick={() => {
                    typeof onAIInsightClick == "function" &&
                      onAIInsightClick({ logId: log?._id?.$oid ?? "" });
                  }}
                >
                  <MdOutlineAutoAwesome />
                  <span className="ml-1">AI</span>
                </Button>
              </Tooltip>
            </View.If>
          </div>
        </div>
        <div className="flex flex-row justify-between pb-2 border-b-[1px] border-neutral-200 dark:border-dark-border">
          <div className="flex flex-row gap-1 items-center w-full">
            <View.If visible={isTypeError}>
              <MdOutlineError size={24} className="fill-red-700" />
            </View.If>
            <View.If visible={!!log?.data?.message}>
              <div className="text-sm w-full break-all dark:text-dark-text">
                {log?.data?.message}
              </div>
            </View.If>
            <View.If
              visible={
                !log?.data?.message && log?.data && !isJson && !isEmptyObject
              }
            >
              <div className="text-sm w-full break-all">{log?.data}</div>
            </View.If>
            <View.If visible={!log?.data?.message && log?.data && isJson}>
              <Codeblock data={log?.data}>
                <JSONPretty
                  id="json-pretty"
                  data={log?.data}
                  className="text-sm overflow-auto"
                ></JSONPretty>
              </Codeblock>
            </View.If>
          </div>
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          <View.If hidden={!log?.options?.type}>
            <LogCardEntry title="Type" value={log?.options?.type} />
          </View.If>
          <View.If hidden={!log?.env?.type}>
            <LogCardEntry title="Environment" value={log?.env?.type} />
          </View.If>
          <View.If hidden={!log?.env?.ver}>
            <LogCardEntry title="Platform" value="NextJS" />
          </View.If>
          <View.If hidden={!log?.path}>
            <LogCardEntry title="Path" value={log?.path} />
          </View.If>
          <View.If hidden={!log?.options?.action}>
            <LogCardEntry title="Action" value={log?.options?.action} />
          </View.If>
          <View.If hidden={!log?.data?.filename}>
            <LogCardEntry title="File" value={log?.data?.filename} />
          </View.If>
          <View.If hidden={!log?.batchConfig?.config?.user}>
            <LogCardEntry title="User" value={log?.batchConfig?.config?.user} />
          </View.If>
          <View.If hidden={!log?.batchConfig?.config?.platform}>
            <LogCardEntry
              title="Platform"
              value={log?.batchConfig?.config?.platform}
            />
          </View.If>
          <View.If hidden={!log?.batchConfig?.config?.appVersion}>
            <LogCardEntry
              title="App Version"
              value={log?.batchConfig?.config?.appVersion}
            />
          </View.If>
          <View.If hidden={!log?.batch?.env?.type}>
            <LogCardEntry title="Environment" value={log?.batch?.env?.type} />
          </View.If>
          <View.If
            visible={!!log?.guid && !!log?._id?.$oid && !!log?.batchId?.$oid}
          >
            <details className="w-full group">
              <summary
                className="dark:text-white text-black flex flex-row items-center gap-1 cursor-pointer"
                style={{
                  listStyle: "none",
                  userSelect: "none",
                }}
              >
                <HiOutlinePlus className="block group-open:hidden" />
                <HiOutlineMinus className="hidden group-open:block" />
                <span>Details</span>
              </summary>
              <div className="flex flex-row gap-2 flex-wrap items-start">
                <View.If hidden={!log?.guid}>
                  <LogCardEntry title="GUID" value={log?.guid} />
                </View.If>
                <View.If hidden={!log?._id?.$oid}>
                  <LogCardEntry title="ID" value={log?._id?.$oid} />
                </View.If>
                <View.If hidden={!log?.batchId?.$oid}>
                  <LogCardEntry title="Batch ID" value={log?.batchId?.$oid} />
                </View.If>
              </div>
            </details>
          </View.If>
          <View.If hidden={!log?.data?.stack}>
            <details className="w-full group">
              <summary
                className="dark:text-white text-black flex flex-row items-center gap-1 cursor-pointer"
                style={{
                  listStyle: "none",
                  userSelect: "none",
                }}
              >
                <HiOutlinePlus className="block group-open:hidden" />
                <HiOutlineMinus className="hidden group-open:block" />
                <span>Stack Trace</span>
              </summary>
              <div className="p-2 bg-neutral-200 dark:bg-neutral-900 rounded">
                <span className="text-xs whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 px-1 rounded">
                  {log?.data?.stack}
                </span>
              </div>
            </details>
          </View.If>
        </div>
      </div>
    </div>
  );
}
