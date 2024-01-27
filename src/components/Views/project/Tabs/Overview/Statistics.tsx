import { useMemo } from "react";

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
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

export default function Statistics() {
  const project = useProjectStore((state) => state.currentProject);
  const isProjectNew = project?.logUsage === 0;

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
  const LogRateLabels = useMemo(
    () =>
      project?.logRate?.length ? project?.logRate?.map((log) => log?._id) : [],
    [project?.logRate]
  );
  const LogRateData = useMemo(
    () =>
      project?.logRate?.length
        ? project?.logRate?.map((log) => log?.count)
        : [],
    [project?.logRate]
  );
  const LogRateErrorData = useMemo(
    () =>
      project?.logRate?.length
        ? project?.logRate?.map((log) => log["ERROR"])
        : [],
    [project?.logRate]
  );
  const LogRateAutoErrorData = useMemo(
    () =>
      project?.logRate?.length
        ? project?.logRate?.map((log) => log["AUTO:ERROR"])
        : [],
    [project?.logRate]
  );
  const LogRateUnhandledRejectionData = useMemo(
    () =>
      project?.logRate?.length
        ? project?.logRate?.map((log) => log["AUTO:UNHANDLEDREJECTION"])
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

  const LogPathsLabels = useMemo(
    () =>
      project?.logPaths?.length
        ? project?.logPaths?.map((log) => log?._id)
        : [],
    [project?.logPaths]
  );
  const LogPathsErrorData = useMemo(
    () =>
      project?.logPaths?.length
        ? project?.logPaths?.map((log) => {
            return (
              log["AUTO:ERROR"] + log["AUTO:UNHANDLEDREJECTION"] + log["ERROR"]
            );
          })
        : [],
    [project?.logPaths]
  );
  const LogPathsLogData = useMemo(
    () =>
      project?.logPaths?.length
        ? project?.logPaths?.map((log) => log.count)
        : [],
    [project?.logPaths]
  );

  if (isProjectNew) {
    return (
      <span className="text-sm text-neutral-500 dark:text-dark-accent">
        No statistics yet.
      </span>
    );
  }

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
          ],
        }}
      />

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
          labels: LogRateLabels,
          datasets: [
            {
              label: "Log Rate (per day)",
              data: LogRateData,
              borderColor: "#8a8a8a",
              backgroundColor: "#8a8a8aaf",
            },
            {
              label: "ERROR (per day)",
              data: LogRateErrorData,
              borderColor: "#b91c1c",
              backgroundColor: "#b91c1caf",
            },
            {
              label: "AUTO:ERROR (per day)",
              data: LogRateAutoErrorData,
              borderColor: "#b91c1c",
              backgroundColor: "#b91c1caf",
            },
            {
              label: "AUTO:UNHANDLEDREJECTION (per day)",
              data: LogRateUnhandledRejectionData,
              borderColor: "#b91c1c",
              backgroundColor: "#b91c1caf",
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

      <div className="w-full flex items-center justify-center">
        <div className="w-1/2 flex items-center flex-col">
          <div>Log Paths</div>
          <Doughnut
            data={{
              labels: LogPathsLabels,
              datasets: [
                {
                  label: "Error Count",
                  data: LogPathsErrorData,
                  borderColor: "#b91c1c",
                  backgroundColor: "#b91c1caf",
                },
                {
                  label: "Log Count",
                  data: LogPathsLogData,
                  borderColor: "#8a8a8a",
                  backgroundColor: "#8a8a8aaf",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
