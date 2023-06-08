import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineArrowBack } from "react-icons/md";

import Container from "@/components/Container";
import Button from "@/components/Button";
import View from "@/components/View";
import { Log } from "@/utils";
import { useProjectStore } from "@/stores/projectStore";
import { BuildComponent } from "@/utils/style";

export default function BatchHeader() {
  const project = useProjectStore((state) => state.currentProject);
  const loading = useProjectStore((state) => state.loading);
  const batchLoading = useProjectStore((state) => state.batchLoading);
  const batch = useProjectStore((state) => state.currentBatch);
  const router = useRouter();
  const { batchId } = router.query;

  return (
    <>
      <Container className="flex flex-col sm:flex-row sm:items-center items-start gap-2 sm:gap-4">
        <View.If visible={loading || batchLoading}>
          <div className="flex h-10 w-28 dark:bg-neutral-900 bg-neutral-200 animate-pulse"></div>
        </View.If>
        <View.If visible={!loading && !batchLoading}>
          <Link href={`/project/${project?.name}?page=batches`}>
            <Button
              light="dark:bg-white bg-black dark:text-black"
              className="px-4  text-white"
            >
              <MdOutlineArrowBack size={18} />
              <span className="ml-2">Back</span>
            </Button>
          </Link>
        </View.If>
        <View.If hidden={loading || batchLoading}>
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-center">
              <h1 className="text-2xl font-semibold">Viewing Batch</h1>
              <View.If visible={!!batch?.env?.git}>
                <span className="text-xs whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-1 rounded-full">
                  {`branch: ${batch?.env?.git}`}
                </span>
              </View.If>
              <View.If visible={!!batch?.env?.gitCommitMessage}>
                <span className="text-xs whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-1 rounded-full">
                  {`commit: ${batch?.env?.gitCommitMessage}`}
                </span>
              </View.If>
              <View.If visible={!!batch?.env?.gitCommitAuthorLogin}>
                <span className="text-xs whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-1 rounded-full">
                  {`author: ${batch?.env?.gitCommitAuthorLogin}`}
                </span>
              </View.If>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center items-start">
              <div className="text-xs text-neutral-400">{`id: ${batchId}`}</div>
              <div className="flex flex-row flex-wrap gap-2 items-start">
                {batch?.logTypes &&
                  Object.keys(batch?.logTypes)
                    .sort((a: any, b: any) => {
                      return batch?.logTypes[a] > batch?.logTypes[b] ? -1 : 1;
                    })
                    .map((batchType: any) => {
                      return (
                        <li
                          key={`batchCard-${batchType}`}
                          className={
                            BuildComponent({
                              defaultClasses:
                                "flex flex-row gap-2 items-center border-[1px] px-1 rounded",
                              conditionalClasses: [
                                {
                                  true: "border-red-400 dark:border-red-800",
                                  false:
                                    "border-neutral-200 dark:border-neutral-900",
                                },
                              ],
                              selectedClasses: [
                                batchType == "ERROR" ||
                                  batchType == "AUTO:ERROR" ||
                                  batchType == "AUTO:UNHANDLEDREJECTION",
                              ],
                            }).classes
                          }
                        >
                          <div className="flex flex-row gap-[2px] items-center">
                            <span className="text-sm">
                              {batchType != "undefined" ? batchType : "LOG"}
                            </span>
                            <span className="text-neutral-500 text-xs">
                              ({batch?.logTypes[batchType]})
                            </span>
                          </div>
                        </li>
                      );
                    })}
              </div>
            </div>
          </div>
        </View.If>
        <View.If visible={loading || batchLoading}>
          <div className="flex flex-col gap-1 animate-pulse">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-900 w-48"></div>
            <div className="h-2.5 bg-neutral-200  dark:bg-neutral-900 w-32"></div>
          </div>
        </View.If>
      </Container>
    </>
  );
}
