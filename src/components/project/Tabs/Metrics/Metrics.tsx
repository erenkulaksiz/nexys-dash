import { useProjectStore } from "@/stores/projectStore";
import { RiDashboard2Fill } from "react-icons/ri";
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
              title="Total Metric Logs"
              type="Logs"
              value={Number(project?.metrics?.totalMetricLogs) || 0}
              decimals={0}
            />
          </div>
          <div className="flex flex-col gap-4 px-4 pt-4 text-3xl font-semibold">
            <h1>Average</h1>
            <div className="w-full border-b-[1px] border-neutral-200 dark:border-neutral-900"></div>
          </div>
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 p-4">
            <Metric
              title="FCP"
              smallTitle="First Contentful Paint"
              type="ms"
              value={Number(project?.metrics?.FCP?.toFixed(2)) || 0}
            />
            <Metric
              title="LCP"
              smallTitle="Largest Contentful Paint"
              type="ms"
              value={Number(project?.metrics?.LCP?.toFixed(2)) || 0}
            />
            <Metric
              title="CLS"
              smallTitle="Cumulative Layout Shift"
              value={Number(project?.metrics?.CLS?.toFixed(2)) || 0}
            />
            <Metric
              title="FID"
              smallTitle="First Input Delay"
              type="ms"
              value={Number(project?.metrics?.FID?.toFixed(2)) || 0}
            />
            <Metric
              title="TTFB"
              smallTitle="Time to First Byte"
              type="ms"
              value={Number(project?.metrics?.TTFB?.toFixed(2)) || 0}
            />
          </div>
          <div className="flex flex-col gap-4 px-4 pt-4 text-3xl font-semibold">
            <h1>Average of last 100 Logs</h1>
            <div className="w-full border-b-[1px] border-neutral-200 dark:border-neutral-900"></div>
          </div>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
