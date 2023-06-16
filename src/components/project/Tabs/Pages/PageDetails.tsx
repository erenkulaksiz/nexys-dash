import Button from "@/components/Button";
import { MdArrowBack } from "react-icons/md";
import { HiDocument } from "react-icons/hi";
import usePathDetails from "@/hooks/usePathDetails";

interface PageDetailsProps {
  selected: string | null;
  onBack: () => void;
}

export default function PageDetails({ selected, onBack }: PageDetailsProps) {
  const { pathDetails, pathDetailsLoading } = usePathDetails({
    path: selected || "/",
  });

  const sortErrorLogs = Object.keys(
    pathDetails.data?.data?.pathLogCounts || {}
  ).filter(
    (el) =>
      el == "ERROR" || el == "AUTO:ERROR" || el == "AUTO:UNHANDLEDREJECTION"
  );

  const sortedErrorLogs = sortErrorLogs
    .map((el) => {
      return {
        name: el,
        count: pathDetails.data?.data?.pathLogCounts?.[el] || 0,
      };
    })
    .sort((a, b) => b.count - a.count)
    .filter((el) => el.count > 0);

  console.log("test", sortedErrorLogs);

  return (
    <div className="border-[1px] sm:order-first order-last border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
      <div className="w-full">
        <div className="flex flex-row gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
          <Button className="px-2" onClick={onBack}>
            <MdArrowBack className="mr-1" />
            <span>Back</span>
          </Button>
          <div className="flex flex-row items-center gap-2">
            <HiDocument />
            <span>{`Page Details: ${selected}`}</span>
          </div>
        </div>
        <div className="p-4 flex flex-col items-start gap-1">
          <div className="flex flex-row gap-2">
            {sortedErrorLogs.map((el) => (
              <div
                className="flex flex-row p-1 px-2 items-center gap-1 text-sm whitespace-pre-wrap break-all dark:text-white text-white bg-red-500 dark:bg-red-900 rounded-full"
                key={el.name}
              >
                <span>{el.name}</span>
                <span className="flex rounded-lg px-1 dark:bg-neutral-900 bg-white dark:text-white text-black">
                  {el.count}
                </span>
              </div>
            ))}
          </div>
          {pathDetailsLoading && <div>Loading...</div>}
        </div>
      </div>
    </div>
  );
}
