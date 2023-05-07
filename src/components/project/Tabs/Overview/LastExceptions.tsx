import { useState } from "react";

import LogCard from "@/components/project/LogCard";
import useLogs from "@/hooks/useLogs";
import Pager from "@/components/Pager";
import { useProjectStore } from "@/stores/projectStore";

export default function LastExceptions() {
  const [page, setPage] = useState<number>(0);
  const lastExceptions = useLogs({ type: "exceptions", page });
  const exceptionsLoading = useProjectStore((state) => state.exceptionsLoading);

  const totalPages = Math.ceil(
    lastExceptions.data?.data?.exceptionsLength / 10
  );

  return (
    <div className="flex flex-col gap-2">
      {lastExceptions.data?.data?.exceptions?.length != 0 &&
        totalPages >= 10 && (
          <Pager
            currentPage={page}
            totalPages={totalPages}
            perPage={2}
            onPageClick={(page) => setPage(page)}
            onPreviousClick={() => page != 0 && setPage(page - 1)}
            onNextClick={() => page + 1 < totalPages && setPage(page + 1)}
          />
        )}
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
      {!exceptionsLoading &&
        lastExceptions.data?.data?.exceptions?.map((exception: any) => (
          <LogCard log={exception} key={exception._id} />
        ))}
    </div>
  );
}
