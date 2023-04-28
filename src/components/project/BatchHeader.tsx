import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineArrowBack } from "react-icons/md";

import Container from "@/components/Container";
import Button from "@/components/Button";
import { useProjectStore } from "@/stores/projectStore";

export default function BatchHeader() {
  const project = useProjectStore((state) => state.currentProject);
  const router = useRouter();
  const { batchId } = router.query;

  return (
    <>
      <Container className="flex flex-row items-center gap-4">
        <Link href={`/project/${project?.name}`}>
          <Button
            light="dark:bg-white bg-black dark:text-black"
            className="px-4  text-white"
          >
            <MdOutlineArrowBack size={18} />
            <span className="ml-2">Back</span>
          </Button>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">Viewing Batch</h1>
          <div className="text-xs text-neutral-400">{`id: ${batchId}`}</div>
        </div>
      </Container>
    </>
  );
}
