import { useMemo } from "react";
import Link from "next/link";

import { ReportType } from "@/types";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { useProjectStore } from "@/stores/projectStore";
import { MdOutlineArrowForward } from "react-icons/md";
import Button from "@/components/Button";
import View from "@/components/View";
import Tooltip from "@/components/Tooltip";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartJSTooltip,
  Legend,
  BarElement,
  ArcElement
);

export default function Report({ report }: { report: ReportType }) {
  const project = useProjectStore((state) => state.currentProject);

  const DailyCountLabels = useMemo(
    () =>
      report?.dailyCount?.length
        ? report?.dailyCount?.map((count) => count?.date)
        : [],
    [report?.dailyCount]
  );
  const DailyCountData = useMemo(
    () =>
      report?.dailyCount?.length
        ? report?.dailyCount?.map((count) => count?.count)
        : [],
    [report?.dailyCount]
  );
  const affectedUsers = useMemo(() => {
    return report?.affectedUsers
      ?.map(({ user }) => {
        if (!user[0]) return null;
        return user[0];
      })
      .filter((user) => user != null);
  }, [report?.affectedUsers]);

  return (
    <details className="p-4 group w-full border-b-[1px] dark:border-dark-border">
      <summary
        className="cursor-pointer text-lg dark:text-dark-text flex flex-row justify-between"
        style={{
          listStyle: "none",
          userSelect: "none",
        }}
      >
        <div className="flex flex-row gap-2 items-center">
          <div className="flex items-center">
            <HiOutlinePlus className="block group-open:hidden" />
            <HiOutlineMinus className="hidden group-open:block" />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Tooltip content="Error Message">
              <span className="text-sm max-w-[600px]">{report?._id}</span>
            </Tooltip>
            <Tooltip content={"Occurrence"}>
              <span className="text-xs dark:border-dark-border border-[1px] p-1 px-2 rounded-xl">
                {report?.count}
              </span>
            </Tooltip>
          </div>
        </div>
        <Tooltip content="Report Details">
          <Link
            href={`/project/${project?.name}/report/${encodeURIComponent(
              report?._id.toLowerCase()
            )}`}
            className="items-center flex"
          >
            <Button className="px-2">
              <MdOutlineArrowForward />
            </Button>
          </Link>
        </Tooltip>
      </summary>
      <div className="flex flex-col mt-4 border-t-[1px] dark:border-dark-border">
        <div className="grid sm:grid-cols-2 grid-cols-1 mt-4">
          <div className="flex flex-col gap-2">
            <div className="dark:text-dark-text text-2xl">Daily Occurrence</div>
            <Line
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      callback: function (
                        tickValue: string | number
                      ): number | undefined {
                        if (Math.floor(Number(tickValue)) === tickValue) {
                          return tickValue;
                        }
                        return undefined;
                      },
                    },
                  },
                },
              }}
              data={{
                labels: DailyCountLabels,
                datasets: [
                  {
                    label: "Error Rate (per day)",
                    data: DailyCountData,
                    borderColor: "#b91c1c",
                    backgroundColor: "#b91c1caf",
                  },
                ],
              }}
            />
          </div>
          <div className="flex flex-col gap-2 items-start">
            <div className="dark:text-dark-text text-2xl">Affected Users</div>
            <View viewIf={affectedUsers?.length == 0}>
              <View.If>
                <div className="dark:text-dark-accent">
                  No configured users found.
                </div>
              </View.If>
              <View.Else>
                <div className="text-xs dark:border-dark-border border-[1px] p-1 px-2 rounded-xl">
                  {affectedUsers.length}
                </div>
              </View.Else>
            </View>
          </div>
        </div>
      </div>
    </details>
  );
}
