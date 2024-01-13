import { useProjectStore } from "@/stores/projectStore";
import { RiDashboard2Fill } from "react-icons/ri";
import MetricScore from "./MetricScore";
import Metric from "./Metric";

export default function Metrics() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row justify-between items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <RiDashboard2Fill />
              <span>Metrics</span>
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
          <div className="flex flex-col px-4 pt-4 text-xl sm:text-3xl font-semibold">
            <h1>Average Performance</h1>
            <div className="text-sm pb-4 text-neutral-500">
              Hover over metrics to view the performance score.
            </div>
            <div className="w-full border-b-[1px] border-neutral-200 dark:border-neutral-900"></div>
          </div>
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 p-4 pb-0">
            <Metric
              title="FCP"
              smallTitle="First Contentful Paint"
              type="ms"
              value={Number(project?.metrics?.FCP?.toFixed(2)) || 0}
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={1800}
                  maxScore={3000}
                  score={Number(project?.metrics?.FCP?.toFixed(2))}
                />
              }
            />
            <Metric
              title="LCP"
              smallTitle="Largest Contentful Paint"
              type="ms"
              value={Number(project?.metrics?.LCP?.toFixed(2)) || 0}
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={2500}
                  maxScore={5000}
                  score={Number(project?.metrics?.LCP?.toFixed(2))}
                />
              }
            />
            <Metric
              title="CLS"
              smallTitle="Cumulative Layout Shift"
              value={Number(project?.metrics?.CLS?.toFixed(2)) || 0}
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={0.1}
                  maxScore={0.25}
                  score={Number(project?.metrics?.CLS?.toFixed(2))}
                />
              }
            />
            <Metric
              title="FID"
              smallTitle="First Input Delay"
              type="ms"
              value={Number(project?.metrics?.FID?.toFixed(2)) || 0}
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={100}
                  maxScore={300}
                  score={Number(project?.metrics?.FID?.toFixed(2))}
                />
              }
            />
            <Metric
              title="TTFB"
              smallTitle="Time to First Byte"
              type="ms"
              value={Number(project?.metrics?.TTFB?.toFixed(2)) || 0}
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={800}
                  maxScore={1800}
                  score={Number(project?.metrics?.TTFB?.toFixed(2))}
                />
              }
            />
            <Metric
              title="Core Init"
              type="ms"
              value={Number(project?.metrics?.CORE_INIT?.toFixed(2)) || 0}
            />
            <Metric
              title="Log Pool Send All"
              type="ms"
              value={Number(project?.metrics?.LOGPOOL_SENDALL?.toFixed(2)) || 0}
            />
          </div>
          <div className="flex flex-col gap-4 px-4 pt-4 text-xl sm:text-3xl font-semibold">
            <h1>Average Performance of last 100 Logs</h1>
            <div className="w-full border-b-[1px] border-neutral-200 dark:border-neutral-900"></div>
          </div>
          <div>[#TODO: CHANGE LAST 100 LOGS TO SOMETHING]</div>
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 p-4">
            <Metric
              title="FCP"
              smallTitle="First Contentful Paint"
              type="ms"
              value={Number(project?.metrics?.last100?.FCP?.toFixed(2)) || 0}
              arrow={
                project?.metrics?.last100?.FCP
                  ? Number(project?.metrics?.last100?.FCP) <
                    Number(project?.metrics?.FCP)
                    ? "up"
                    : "down"
                  : null
              }
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={1800}
                  maxScore={3000}
                  score={Number(project?.metrics?.last100?.FCP?.toFixed(2))}
                />
              }
            />
            <Metric
              title="LCP"
              smallTitle="Largest Contentful Paint"
              type="ms"
              value={Number(project?.metrics?.last100?.LCP?.toFixed(2)) || 0}
              arrow={
                project?.metrics?.last100?.LCP
                  ? Number(project?.metrics?.last100?.LCP) <
                    Number(project?.metrics?.LCP)
                    ? "up"
                    : "down"
                  : null
              }
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={2500}
                  maxScore={5000}
                  score={Number(project?.metrics?.last100?.LCP?.toFixed(2))}
                />
              }
            />
            <Metric
              title="CLS"
              smallTitle="Cumulative Layout Shift"
              value={Number(project?.metrics?.last100?.CLS?.toFixed(2)) || 0}
              arrow={
                project?.metrics?.last100?.CLS
                  ? Number(project?.metrics?.last100?.CLS) <
                    Number(project?.metrics?.CLS)
                    ? "up"
                    : "down"
                  : null
              }
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={0.1}
                  maxScore={0.25}
                  score={Number(project?.metrics?.last100?.CLS?.toFixed(2))}
                />
              }
            />
            <Metric
              title="FID"
              smallTitle="First Input Delay"
              type="ms"
              value={Number(project?.metrics?.last100?.FID?.toFixed(2)) || 0}
              arrow={
                project?.metrics?.last100?.FID
                  ? Number(project?.metrics?.last100?.FID) <
                    Number(project?.metrics?.FID)
                    ? "up"
                    : "down"
                  : null
              }
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={100}
                  maxScore={300}
                  score={Number(project?.metrics?.last100?.FID?.toFixed(2))}
                />
              }
            />
            <Metric
              title="TTFB"
              smallTitle="Time to First Byte"
              type="ms"
              value={Number(project?.metrics?.last100?.TTFB?.toFixed(2)) || 0}
              arrow={
                project?.metrics?.last100?.TTFB
                  ? Number(project?.metrics?.last100?.TTFB) <
                    Number(project?.metrics?.TTFB)
                    ? "up"
                    : "down"
                  : null
              }
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={800}
                  maxScore={1800}
                  score={Number(project?.metrics?.last100?.TTFB?.toFixed(2))}
                />
              }
            />
            <Metric
              title="Core Init"
              type="ms"
              value={
                Number(project?.metrics?.last100?.CORE_INIT?.toFixed(2)) || 0
              }
              arrow={
                project?.metrics?.last100?.TTFB
                  ? Number(project?.metrics?.last100?.CORE_INIT) <
                    Number(project?.metrics?.CORE_INIT)
                    ? "up"
                    : "down"
                  : null
              }
            />
            <Metric
              title="Log Pool Send All"
              type="ms"
              value={
                Number(
                  project?.metrics?.last100?.LOGPOOL_SENDALL?.toFixed(2)
                ) || 0
              }
              arrow={
                project?.metrics?.last100?.LOGPOOL_SENDALL
                  ? Number(project?.metrics?.last100?.LOGPOOL_SENDALL) <
                    Number(project?.metrics?.LOGPOOL_SENDALL)
                    ? "up"
                    : "down"
                  : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
