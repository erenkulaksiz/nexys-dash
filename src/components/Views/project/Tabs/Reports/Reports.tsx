import { useProjectStore } from "@/stores/projectStore";
import View from "@/components/View";
import { MdBugReport } from "react-icons/md";
import Report from "./Report";

export default function Reports() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-dark-border rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row justify-between items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-dark-border">
            <div className="flex flex-row gap-2 items-center">
              <MdBugReport />
              <span className="dark:text-dark-text">Reports</span>
            </div>
          </div>
          <View viewIf={project?.report?.length == 0}>
            <View.If>
              <div className="p-4 dark:text-dark-accent">No reports found.</div>
            </View.If>
            <View.Else>
              <div className="flex flex-col w-full">
                <h1 className="text-2xl dark:text-dark-text border-b-[1px] dark:border-dark-border p-4 font-semibold">
                  Most Occurring Errors
                </h1>
                <div className="w-full flex flex-col pb-4">
                  {project?.report?.map((report) => (
                    <Report report={report} key={report._id} />
                  ))}
                </div>
              </div>
            </View.Else>
          </View>
        </div>
      </div>
    </div>
  );
}
