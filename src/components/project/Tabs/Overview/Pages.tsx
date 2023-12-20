import { useProjectStore } from "@/stores/projectStore";
import View from "@/components/View";
import Tooltip from "@/components/Tooltip";
import { MdInfoOutline } from "react-icons/md";

export default function Pages() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <div className="flex flex-col gap-2 items-start">
      <View viewIf={!!project?.logPaths?.length}>
        <View.If>
          {project?.logPaths?.slice(0, 10).map((path, index) => {
            const errors =
              path.ERROR + path["AUTO:ERROR"] + path["AUTO:UNHANDLEDREJECTION"];

            return (
              <div
                className="flex gap-1 flex-row items-center text-xs"
                key={path._id}
              >
                <div className="flex">{path._id}</div>
                <div className="text-sm dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-2 rounded">
                  {path.count}
                </div>
                <View.If visible={errors > 0}>
                  <Tooltip
                    outline
                    content={
                      <div className="flex flex-col">
                        <View.If visible={path.ERROR > 0}>
                          <div className="flex flex-row gap-2">
                            <div>ERROR</div>
                            <div className="text-sm dark:text-white text-white bg-red-500 dark:bg-red-900 px-2 rounded">
                              {path.ERROR}
                            </div>
                          </div>
                        </View.If>
                        <View.If visible={path["AUTO:ERROR"] > 0}>
                          <div className="flex flex-row gap-2">
                            <div>AUTO:ERROR</div>
                            <div className="text-sm dark:text-white text-white bg-red-500 dark:bg-red-900 px-2 rounded">
                              {path["AUTO:ERROR"]}
                            </div>
                          </div>
                        </View.If>
                        <View.If visible={path["AUTO:UNHANDLEDREJECTION"] > 0}>
                          <div className="flex flex-row gap-2">
                            <div>AUTO:UNHANDLEDREJECTION</div>
                            <div className="text-sm dark:text-white text-white bg-red-500 dark:bg-red-900 px-2 rounded">
                              {path["AUTO:UNHANDLEDREJECTION"]}
                            </div>
                          </div>
                        </View.If>
                      </div>
                    }
                  >
                    <div className="flex flex-row items-center gap-1 text-sm whitespace-pre-wrap break-all dark:text-white text-white bg-red-500 dark:bg-red-900 px-1 pr-2 rounded">
                      <MdInfoOutline size={14} />
                      <span>{errors}</span>
                    </div>
                  </Tooltip>
                </View.If>
              </div>
            );
          })}
          <View.If
            visible={project?.logPaths && project?.logPaths?.length > 10}
          >
            <div className="flex flex-row items-center gap-1 text-sm whitespace-pre-wrap break-all dark:text-white text-black bg-neutral-200 dark:bg-neutral-900 px-1 pr-2 rounded-full">
              <MdInfoOutline size={14} />
              <span>
                {project?.logPaths?.length && project?.logPaths?.length - 10}{" "}
                more...
              </span>
            </div>
          </View.If>
        </View.If>
        <View.Else>
          <span className="text-sm text-neutral-500">No paths yet.</span>
        </View.Else>
      </View>
    </div>
  );
}
