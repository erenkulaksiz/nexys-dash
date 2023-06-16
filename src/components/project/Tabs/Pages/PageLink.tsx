import { MdInfoOutline } from "react-icons/md";
import Tooltip from "@/components/Tooltip";
import View from "@/components/View";
import Button from "@/components/Button";
import type { LogMetricTypes } from "@/types";

interface PageLinkProps {
  path: LogMetricTypes;
  onSelect: (path: string) => void;
}

export default function PageLink({ path, onSelect }: PageLinkProps) {
  const errors =
    path.ERROR + path["AUTO:ERROR"] + path["AUTO:UNHANDLEDREJECTION"];

  return (
    <div className="flex gap-1 flex-row items-center group h-6" key={path._id}>
      <div className="flex text-sm">{path._id}</div>
      <div className="text-sm dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-2 rounded-full">
        {path.count}
      </div>
      <View.If visible={errors > 0}>
        <div className="flex flex-row items-center gap-1 text-sm whitespace-pre-wrap break-all dark:text-white text-white bg-red-500 dark:bg-red-900 px-1 pr-2 rounded-full">
          <MdInfoOutline size={14} />
          <span>{errors}</span>
        </div>
      </View.If>
      {/*<View.If visible={errors > 0}>
        <Tooltip
          outline
          content={
            <div className="flex flex-col gap-1">
              <View.If visible={path.ERROR > 0}>
                <div className="flex flex-row gap-2">
                  <div>ERROR</div>
                  <div className="text-sm dark:text-white text-white bg-red-500 dark:bg-red-900 px-2 rounded-full">
                    {path.ERROR}
                  </div>
                </div>
              </View.If>
              <View.If visible={path["AUTO:ERROR"] > 0}>
                <div className="flex flex-row gap-2">
                  <div>AUTO:ERROR</div>
                  <div className="text-sm dark:text-white text-white bg-red-500 dark:bg-red-900 px-2 rounded-full">
                    {path["AUTO:ERROR"]}
                  </div>
                </div>
              </View.If>
              <View.If visible={path["AUTO:UNHANDLEDREJECTION"] > 0}>
                <div className="flex flex-row gap-2">
                  <div>AUTO:UNHANDLEDREJECTION</div>
                  <div className="text-sm dark:text-white text-white bg-red-500 dark:bg-red-900 px-2 rounded-full">
                    {path["AUTO:UNHANDLEDREJECTION"]}
                  </div>
                </div>
              </View.If>
            </div>
          }
        >
          <div className="flex flex-row items-center gap-1 text-sm whitespace-pre-wrap break-all dark:text-white text-white bg-red-500 dark:bg-red-900 px-1 pr-2 rounded-full">
            <MdInfoOutline size={14} />
            <span>{errors}</span>
          </div>
        </Tooltip>
        </View.If>*/}
      <Button
        className="hidden group-hover:flex px-2"
        onClick={() => onSelect(path._id)}
      >
        View
      </Button>
    </div>
  );
}
