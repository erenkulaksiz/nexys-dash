import { useProjectStore } from "@/stores/projectStore";
import View from "@/components/View";

export default function Pages() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <div className="flex flex-col gap-2">
      <View viewIf={!!project?.logPaths?.length}>
        <View.If>
          {project?.logPaths?.map((path, index) => {
            const errors =
              path.ERROR + path["AUTO:ERROR"] + path["AUTO:UNHANDLEDREJECTION"];

            return (
              <div className="flex gap-1 flex-row items-center" key={path._id}>
                <div className="flex">{path._id}</div>
                <div className="text-sm whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-2 rounded-full">
                  {path.count}
                </div>
                <div className="text-sm whitespace-pre-wrap break-all dark:text-neutral-400 text-white bg-red-500 dark:bg-red-900 px-2 rounded-full">
                  {errors}
                </div>
              </div>
            );
          })}
        </View.If>
        <View.Else>
          <span className="text-sm text-neutral-500">No paths yet.</span>
        </View.Else>
      </View>
    </div>
  );
}
