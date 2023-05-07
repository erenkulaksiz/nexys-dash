import { RiFilePaperFill } from "react-icons/ri";

import BatchCard from "../../BatchCard/BatchCard";
import { useProjectStore } from "@/stores/projectStore";
import { Log } from "@/utils";
import useLogs from "@/hooks/useLogs";

export default function Batches() {
  const project = useProjectStore((state) => state.currentProject);
  const batches = useLogs({ type: "batches" });
  const batchesLoading = useProjectStore((state) => state.batchesLoading);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row justify-between items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <RiFilePaperFill />
              <span>Batches</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {batchesLoading &&
              Array.from(Array(3)).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-neutral-100 dark:bg-neutral-900 py-20 px-10"
                ></div>
              ))}
            {!batchesLoading && batches?.data?.data?.batches?.length == 0 && (
              <div>No batches found.</div>
            )}
            {!batchesLoading &&
              project &&
              Array.isArray(batches?.data?.data?.batches) &&
              batches?.data?.data?.batches &&
              batches?.data?.data?.batches?.length > 0 &&
              batches?.data?.data?.batches
                ?.sort((a: any, b: any) => b.ts - a.ts)
                .map((batch: any) => {
                  return <BatchCard key={batch._id} batch={batch} />;
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
