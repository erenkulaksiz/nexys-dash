import { useProjectStore } from "@/stores/projectStore";
import { RiDashboard2Fill } from "react-icons/ri";
import MetricScore from "./MetricScore";
import Metric from "./Metric";

export default function Metrics() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-dark-border rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row justify-between items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-dark-border">
            <div className="flex flex-row gap-2 items-center">
              <RiDashboard2Fill />
              <span className="dark:text-dark-text">Metrics</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 p-4 pb-0">
            <Metric
              title="Total Logs"
              type="Logs"
              value={Number(project?.logCount) || 0}
              decimals={0}
              tooltipContent="Total number of logs received"
            />
            <Metric
              title="Total Metric Logs"
              type="Logs"
              value={Number(project?.metrics?.totalMetricLogs) || 0}
              decimals={0}
              tooltipContent="Total number of logs with metrics"
            />
            <Metric
              title="Error Logs"
              type="Logs"
              value={Number(project?.errorCount) || 0}
              decimals={0}
              tooltipContent="Total number of logs with errors"
            />
            <Metric
              title="Batch Count"
              type="Batches"
              value={Number(project?.batchCount) || 0}
              decimals={0}
              tooltipContent="Total number of batches"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 p-4 pb-0">
            <div className="w-full h-[240px] dark:bg-darker bg-neutral-200"></div>
            <div className="w-full h-[240px] dark:bg-darker bg-neutral-200"></div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4">
            <div className="w-full h-[240px] dark:bg-darker bg-neutral-200"></div>
            <div className="w-full h-[240px] dark:bg-darker bg-neutral-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
