import { useState } from "react";

import { RiFilePaperFill } from "react-icons/ri";
import BatchCard from "../../BatchCard";
import { useProjectStore } from "@/stores/projectStore";
import useLogs from "@/hooks/useLogs";
import View from "@/components/View";
import Pager from "@/components/Pager";
import CurrentCountText from "@/components/project/CurrentCountText";

export default function Batches() {
  const [page, setPage] = useState<number>(0);
  const project = useProjectStore((state) => state.currentProject);
  const batches = useLogs({ type: "batches", page });
  const batchesLoading = useProjectStore((state) => state.batchesLoading);

  const totalPages = Math.ceil(batches.data?.data?.batchesLength / 10);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <RiFilePaperFill />
              <span>Batches</span>
            </div>
            <View.If
              visible={
                !batchesLoading && batches.data?.data?.batchesLength != 0
              }
            >
              <CurrentCountText
                count={batches.data?.data?.batchesLength}
                type="batches"
              />
            </View.If>
          </div>
          <View.If visible={!batchesLoading && totalPages > 1}>
            <div className="flex flex-col gap-2 p-4 pb-0">
              <Pager
                currentPage={page}
                totalPages={totalPages}
                perPage={4}
                onPageClick={(page) => setPage(page)}
                onPreviousClick={() => page != 0 && setPage(page - 1)}
                onNextClick={() => page + 1 < totalPages && setPage(page + 1)}
              />
            </div>
          </View.If>
          <div className="flex flex-col gap-2 p-4">
            <View.If visible={batchesLoading}>
              {Array.from(Array(3)).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-neutral-100 dark:bg-neutral-900 py-20 px-10"
                ></div>
              ))}
            </View.If>
            <View.If
              visible={
                !batchesLoading && batches?.data?.data?.batches?.length == 0
              }
            >
              <div>No batches found.</div>
            </View.If>
            <View.If
              visible={
                !batchesLoading &&
                project &&
                Array.isArray(batches?.data?.data?.batches) &&
                batches?.data?.data?.batches &&
                batches?.data?.data?.batches?.length > 0
              }
            >
              {batches?.data?.data?.batches
                ?.sort((a: any, b: any) => b.ts - a.ts)
                .map((batch: any) => {
                  return <BatchCard key={batch._id} batch={batch} />;
                })}
            </View.If>
          </div>
        </div>
      </div>
    </div>
  );
}
