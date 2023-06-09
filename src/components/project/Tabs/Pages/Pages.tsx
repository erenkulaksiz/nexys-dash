import View from "@/components/View";
import Tooltip from "@/components/Tooltip";
import { useProjectStore } from "@/stores/projectStore";
import { MdInfoOutline } from "react-icons/md";
import { HiDocument } from "react-icons/hi";

export default function Pages() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <View viewIf={project?.logPaths && project?.logPaths?.length > 2}>
      <View.If>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2 pt-2 items-start">
          <div className="border-[1px] sm:order-first order-last border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
            <div className="w-full">
              <div className="flex flex-row gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
                <HiDocument />
                <span>Pages</span>
              </div>

              <div className="p-4 flex flex-col gap-1">
                {project?.logPaths?.map((path, index) => {
                  const errors =
                    path.ERROR +
                    path["AUTO:ERROR"] +
                    path["AUTO:UNHANDLEDREJECTION"];

                  return (
                    <div
                      className="flex gap-1 flex-row items-center text-xs"
                      key={path._id}
                    >
                      <div className="flex">{path._id}</div>
                      <div className="text-sm dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-2 rounded-full">
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
                              <View.If
                                visible={path["AUTO:UNHANDLEDREJECTION"] > 0}
                              >
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
                      </View.If>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </View.If>
      <View.Else>
        <div className="mt-2">
          Need atleast different 2 page logs to view this tab.
        </div>
      </View.Else>
    </View>
  );
}
