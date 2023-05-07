import { useProjectStore } from "@/stores/projectStore";
import { MdError } from "react-icons/md";
import useLogs from "@/hooks/useLogs";
import LogCard from "@/components/project/LogCard";

export default function Exceptions() {
  const project = useProjectStore((state) => state.currentProject);
  const exceptions = useLogs({ type: "exceptions" });
  const exceptionsLoading = useProjectStore((state) => state.exceptionsLoading);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 py-2 items-start">
      <div className="border-[1px] border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row justify-between items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <MdError />
              <span>Exceptions</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {exceptionsLoading &&
              Array.from(Array(3)).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-neutral-100 dark:bg-neutral-900 py-20 px-10"
                ></div>
              ))}
            {!exceptionsLoading &&
              exceptions.data?.data?.exceptions?.length == 0 && (
                <div>No exceptions found.</div>
              )}
            {!exceptionsLoading &&
              project &&
              Array.isArray(exceptions.data?.data?.exceptions) &&
              exceptions.data?.data?.exceptions &&
              exceptions.data?.data?.exceptions.length > 0 &&
              exceptions.data?.data?.exceptions.map((exception: any) => {
                return <LogCard log={exception} key={exception._id} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
