import { useMemo } from "react";

import LogCard from "../LogCard";

export default function LogBatch({ batch, type }: any) {
  const filtered = useMemo(
    () =>
      batch?.data?.logs?.filter((log: any) => {
        if (type == "exception") {
          return (
            log?.options?.type == "AUTO:ERROR" ||
            log?.options?.type == "ERROR" ||
            log?.options?.type == "AUTO:UNHANDLEDREJECTION"
          );
        } else if (type == "log") {
          return (
            log?.options?.type != "AUTO:ERROR" &&
            log?.options?.type != "ERROR" &&
            log?.options?.type != "AUTO:UNHANDLEDREJECTION" &&
            log?.options?.type != "METRIC"
          );
        } else if (!type) {
          return true;
        }
      }),
    [batch?.data?.logs]
  );

  const { config, deviceData, env, options } = batch?.data;

  const data = {
    config,
    deviceData,
    env,
    options,
    package: batch?.data?.package,
    _id: batch?._id,
  };

  return (
    <>
      {filtered.map((log: any, index: number) => {
        return <LogCard log={log} key={log?._id ?? log?.guid} data={data} />;
      })}
    </>
  );
}
