import { useProjectStore } from "@/stores/projectStore";
import CountUp from "react-countup";
import { RiDashboard2Fill } from "react-icons/ri";

function Metric({
  title,
  smallTitle,
  type,
  value,
  decimals = 2,
}: {
  title: string;
  smallTitle?: string;
  type?: string;
  value: number;
  decimals?: number;
}) {
  return (
    <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
      <div className="border-b-[1px] gap-1 w-full border-neutral-200 dark:border-neutral-900 flex items-center p-2 text-lg sm:text-xl font-semibold">
        <span>{title}</span>
        {smallTitle && (
          <span className="text-xs text-neutral-500">{smallTitle}</span>
        )}
      </div>
      <div className="flex flex-row p-2 gap-1 items-end">
        <CountUp
          end={value}
          duration={2}
          decimals={decimals}
          separator=""
          className="text-4xl font-semibold"
        />
        {type && <div className="text-neutral-500">{type}</div>}
      </div>
    </div>
  );
}

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
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 p-4">
            <Metric
              title="Total Metric Logs"
              type="Logs"
              value={Number(project?.metrics?.totalCount) || 0}
              decimals={0}
            />
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
        </div>
      </div>
    </div>
  );
}
