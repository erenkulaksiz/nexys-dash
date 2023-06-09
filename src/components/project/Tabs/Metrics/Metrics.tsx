import { useProjectStore } from "@/stores/projectStore";
import { RiDashboard2Fill } from "react-icons/ri";
import { map_range } from "@/utils/map";
import Metric from "./Metric";

export default function Metrics() {
  const project = useProjectStore((state) => state.currentProject);

  function MetricScore({
    minScore,
    maxScore,
    midScore,
    score,
  }: {
    minScore: number;
    maxScore: number;
    midScore: number;
    score: number;
  }) {
    const range = map_range(score, minScore, maxScore + 5, 0, 200);

    return (
      <div className="flex flex-row w-[200px] h-[20px] rounded-xl relative">
        <div className="w-full bg-red-600 pl-2 text-xs flex items-center">
          {maxScore}
        </div>
        <div className="w-full bg-yellow-600 text-xs flex items-center justify-center">
          {midScore}
        </div>
        <div className="w-full bg-green-600 flex justify-end pr-2 text-xs items-center">
          {minScore}
        </div>
        <div
          className="absolute inset-0 flex items-center"
          style={{
            transform: `translate(${
              200 - (range > 200 ? 200 : range)
            }px, -2px)`,
          }}
        >
          <span className="text-lg font-bold">|</span>
          <span className="absolute top-6 dark:bg-neutral-800 px-2 rounded-lg">
            {score || "N/A"}
          </span>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col gap-4 px-4 pt-4 text-xl sm:text-3xl font-semibold">
            <h1>Average Performance</h1>
            <div className="w-full border-b-[1px] border-neutral-200 dark:border-neutral-900"></div>
          </div>
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 p-4 pb-0">
            <Metric
              title="FCP"
              smallTitle="First Contentful Paint"
              type="ms"
              value={Number(project?.metrics?.FCP?.value?.toFixed(2)) || 0}
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={1800}
                  maxScore={3000}
                  score={Number(project?.metrics?.FCP?.value?.toFixed(2))}
                />
              }
            />
            <Metric
              title="LCP"
              smallTitle="Largest Contentful Paint"
              type="ms"
              value={Number(project?.metrics?.LCP?.value?.toFixed(2)) || 0}
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={2500}
                  maxScore={5000}
                  score={Number(project?.metrics?.LCP?.value?.toFixed(2))}
                />
              }
            />
            <Metric
              title="CLS"
              smallTitle="Cumulative Layout Shift"
              value={Number(project?.metrics?.CLS?.value?.toFixed(2)) || 0}
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={0.1}
                  maxScore={0.25}
                  score={Number(project?.metrics?.CLS?.value?.toFixed(2))}
                />
              }
            />
            <Metric
              title="FID"
              smallTitle="First Input Delay"
              type="ms"
              value={Number(project?.metrics?.FID?.value?.toFixed(2)) || 0}
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={100}
                  maxScore={300}
                  score={Number(project?.metrics?.FID?.value?.toFixed(2))}
                />
              }
            />
            <Metric
              title="TTFB"
              smallTitle="Time to First Byte"
              type="ms"
              value={Number(project?.metrics?.TTFB?.value?.toFixed(2)) || 0}
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={800}
                  maxScore={1800}
                  score={Number(project?.metrics?.TTFB?.value?.toFixed(2))}
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
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 p-4">
            <Metric
              title="FCP"
              smallTitle="First Contentful Paint"
              type="ms"
              value={
                Number(project?.metrics?.last100?.FCP?.value?.toFixed(2)) || 0
              }
              arrow={
                project?.metrics?.last100?.FCP?.value
                  ? Number(project?.metrics?.last100?.FCP?.value) <
                    Number(project?.metrics?.FCP?.value)
                    ? "up"
                    : "down"
                  : null
              }
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={1800}
                  maxScore={3000}
                  score={Number(
                    project?.metrics?.last100?.FCP?.value?.toFixed(2)
                  )}
                />
              }
            />
            <Metric
              title="LCP"
              smallTitle="Largest Contentful Paint"
              type="ms"
              value={
                Number(project?.metrics?.last100?.LCP?.value?.toFixed(2)) || 0
              }
              arrow={
                project?.metrics?.last100?.LCP?.value
                  ? Number(project?.metrics?.last100?.LCP?.value) <
                    Number(project?.metrics?.LCP?.value)
                    ? "up"
                    : "down"
                  : null
              }
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={2500}
                  maxScore={5000}
                  score={Number(
                    project?.metrics?.last100?.LCP?.value?.toFixed(2)
                  )}
                />
              }
            />
            <Metric
              title="CLS"
              smallTitle="Cumulative Layout Shift"
              value={
                Number(project?.metrics?.last100?.CLS?.value?.toFixed(2)) || 0
              }
              arrow={
                project?.metrics?.last100?.CLS?.value
                  ? Number(project?.metrics?.last100?.CLS?.value) <
                    Number(project?.metrics?.CLS?.value)
                    ? "up"
                    : "down"
                  : null
              }
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={0.1}
                  maxScore={0.25}
                  score={Number(
                    project?.metrics?.last100?.CLS?.value?.toFixed(2)
                  )}
                />
              }
            />
            <Metric
              title="FID"
              smallTitle="First Input Delay"
              type="ms"
              value={
                Number(project?.metrics?.last100?.FID?.value?.toFixed(2)) || 0
              }
              arrow={
                project?.metrics?.last100?.FID?.value
                  ? Number(project?.metrics?.last100?.FID?.value) <
                    Number(project?.metrics?.FID?.value)
                    ? "up"
                    : "down"
                  : null
              }
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={100}
                  maxScore={300}
                  score={Number(
                    project?.metrics?.last100?.FID?.value?.toFixed(2)
                  )}
                />
              }
            />
            <Metric
              title="TTFB"
              smallTitle="Time to First Byte"
              type="ms"
              value={
                Number(project?.metrics?.last100?.TTFB?.value?.toFixed(2)) || 0
              }
              arrow={
                project?.metrics?.last100?.TTFB?.value
                  ? Number(project?.metrics?.last100?.TTFB?.value) <
                    Number(project?.metrics?.TTFB?.value)
                    ? "up"
                    : "down"
                  : null
              }
              tooltipContent={
                <MetricScore
                  minScore={0}
                  midScore={800}
                  maxScore={1800}
                  score={Number(
                    project?.metrics?.last100?.TTFB?.value?.toFixed(2)
                  )}
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
                project?.metrics?.last100?.TTFB?.value
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
