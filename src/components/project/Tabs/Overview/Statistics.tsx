import { useMemo, useState } from "react";
import { useProjectStore } from "@/stores/projectStore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

export default function Statistics() {
  const project = useProjectStore((state) => state.currentProject);

  const ExceptionRateLabels = useMemo(
    () =>
      project?.exceptionRate?.length
        ? project?.exceptionRate?.map((log) => log?._id)
        : [],
    [project?.exceptionRate]
  );
  const ExceptionRateData = useMemo(
    () =>
      project?.exceptionRate?.length
        ? project?.exceptionRate?.map((log) => log?.count)
        : [],
    [project?.exceptionRate]
  );
  const LogRateData = useMemo(
    () =>
      project?.logRate?.length
        ? project?.logRate?.map((log) => log?.count)
        : [],
    [project?.logRate]
  );
  const ErrorTypeLabels = useMemo(
    () =>
      project?.errorTypes?.length
        ? project?.errorTypes?.map((log) => log?._id)
        : [],
    [project?.errorTypes]
  );
  const ErrorTypeData = useMemo(
    () =>
      project?.errorTypes?.length
        ? project?.errorTypes?.map((log) => log?.count)
        : [],
    [project?.errorTypes]
  );

  return (
    <div className="w-full justify-center flex flex-col gap-10">
      <Line
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const,
            },
          },
        }}
        data={{
          labels: ExceptionRateLabels,
          datasets: [
            {
              label: "Error Rate (per day)",
              data: ExceptionRateData,
              borderColor: "#b91c1c",
              backgroundColor: "#b91c1caf",
            },
            {
              label: "Log Rate (per day)",
              data: LogRateData,
              borderColor: "#1c7cb9",
              backgroundColor: "#1c7cb9af",
            },
          ],
        }}
      />

      <Bar
        options={{}}
        data={{
          labels: ErrorTypeLabels,
          datasets: [
            {
              label: "Error Type",
              data: ErrorTypeData,
              borderColor: "#b91c1c",
              backgroundColor: "#b91c1caf",
            },
          ],
        }}
      />
    </div>
  );
}
