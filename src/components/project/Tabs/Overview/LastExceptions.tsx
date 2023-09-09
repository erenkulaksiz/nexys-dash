import { useState } from "react";

import LogCard from "@/components/project/LogCard";
import useLogs from "@/hooks/useLogs";
import Pager from "@/components/Pager";
import View from "@/components/View";
import { useProjectStore } from "@/stores/projectStore";

export default function LastExceptions() {
  const [page, setPage] = useState<number>(0);
  const lastExceptions = useLogs({
    type: "exceptions",
    page,
    filters: {
      asc: false,
      types: [],
      path: "all",
      batchVersion: "all",
      configUser: "all",
      search: "",
    },
  });
  const exceptionsLoading = useProjectStore((state) => state.exceptionsLoading);

  const totalPages = Math.ceil(
    lastExceptions.data?.data?.exceptionsLength / 10
  );

  return (
    <div className="flex flex-col gap-4">
      {lastExceptions.data?.data?.exceptions?.length != 0 && totalPages > 1 && (
        <Pager
          currentPage={page}
          totalPages={totalPages}
          perPage={2}
          onPageClick={(page) => setPage(page)}
          onPreviousClick={() => page != 0 && setPage(page - 1)}
          onNextClick={() => page + 1 < totalPages && setPage(page + 1)}
        />
      )}
      <View viewIf={exceptionsLoading}>
        <View.If>
          {Array.from(Array(3)).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-neutral-100 dark:bg-neutral-900 py-20 px-10"
            ></div>
          ))}
        </View.If>
        <View.Else>
          {lastExceptions.data?.data?.exceptions?.length == 0 && (
            <span className="text-sm text-neutral-500">No exceptions yet.</span>
          )}
        </View.Else>
      </View>
      <View.If hidden={exceptionsLoading}>
        {lastExceptions.data?.data?.exceptions?.map((exception: any) => (
          <LogCard log={exception} key={exception._id} />
        ))}
      </View.If>
    </div>
  );
}
