import LogCard from "@/components/project/LogCard";
import useLogs from "@/hooks/useLogs";

import Pager from "@/components/Pager";
import { useProjectStore } from "@/stores/projectStore";

export default function LastExceptions() {
  const lastExceptions = useLogs({ type: "exceptions" });
  const exceptionsLoading = useProjectStore((state) => state.exceptionsLoading);

  return (
    <div className="flex flex-col gap-2">
      {exceptionsLoading &&
        Array.from(Array(3)).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-neutral-100 dark:bg-neutral-900 py-20 px-10"
          ></div>
        ))}
      {!exceptionsLoading &&
        lastExceptions.data?.data?.exceptions?.length == 0 && (
          <div>No exceptions found.</div>
        )}
      {!exceptionsLoading && (
        <>
          {/*lastExceptions.data?.data?.exceptions?.length != 0 && (
            <Pager
              currentPage={1}
              totalPages={40}
              perPage={2}
              onPageClick={() => {}}
              onPreviousClick={() => {}}
              onNextClick={() => {}}
              className="justify-center"
            />
          )*/}
          {lastExceptions.data?.data?.exceptions?.map((exception: any) => (
            <LogCard log={exception} key={exception._id} />
          ))}
        </>
      )}
    </div>
  );
}
