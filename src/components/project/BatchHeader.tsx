import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineArrowBack } from "react-icons/md";

import Container from "@/components/Container";
import Button from "@/components/Button";
import { useProjectStore } from "@/stores/projectStore";

export default function BatchHeader() {
  const project = useProjectStore((state) => state.currentProject);
  const loading = useProjectStore((state) => state.loading);
  const batchLoading = useProjectStore((state) => state.batchLoading);
  const router = useRouter();
  const { batchId } = router.query;

  return (
    <>
      <Container className="flex flex-row items-center gap-4">
        {(loading || batchLoading) && (
          <div className="flex h-10 w-28 dark:bg-neutral-900 bg-neutral-200 animate-pulse"></div>
        )}
        {!loading && !batchLoading && (
          <Link href={`/project/${project?.name}?p=batches`}>
            <Button
              light="dark:bg-white bg-black dark:text-black"
              className="px-4  text-white"
            >
              <MdOutlineArrowBack size={18} />
              <span className="ml-2">Back</span>
            </Button>
          </Link>
        )}
        {!loading && !batchLoading && (
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">Viewing Batch</h1>
            <div className="text-xs text-neutral-400">{`id: ${batchId}`}</div>
          </div>
        )}
        {(loading || batchLoading) && (
          <div className="flex flex-col gap-1 animate-pulse">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-900 w-48"></div>
            <div className="h-2.5 bg-neutral-200  dark:bg-neutral-900 w-32"></div>
          </div>
        )}
      </Container>
    </>
  );
}
