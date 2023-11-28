import { HiOutlineDocument } from "react-icons/hi";
import { IoFlagOutline } from "react-icons/io5";
import { MdAccessTime, MdInfoOutline } from "react-icons/md";
import CountUp from "react-countup";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";

import { TbListDetails } from "react-icons/tb";
import { BsBarChartLine } from "react-icons/bs";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Tooltip from "@/components/Tooltip";
import View from "@/components/View";
import { useProjectStore } from "@/stores/projectStore";
import { BuildComponent } from "@/utils/style";

const Statistics = dynamic(() => import("./Statistics"), {
  loading: () => <Loading />,
});
const LastExceptions = dynamic(() => import("./LastExceptions"), {
  loading: () => <Loading />,
});
const Pages = dynamic(() => import("./Pages"), {
  loading: () => <Loading />,
});

export default function Overview() {
  const project = useProjectStore((state) => state.currentProject);
  const router = useRouter();
  const id = router.query.id;
  const isProjectNew = project?.logUsage === 0;

  const projectScore = isProjectNew
    ? 100
    : Math.floor(
        // @ts-ignore
        100 - (project?.errorCount / project?.logCount) * 100
      );

  function getProjectScoreMessage(score: number) {
    if (score > 80) {
      return "Perfect!";
    } else if (score >= 80) {
      return "Nearly bug free";
    } else if (score >= 70) {
      return "Nice";
    } else if (score >= 50) {
      return "Good";
    } else if (score >= 30) {
      return "Needs improvement";
    } else {
      return "Needs improvement";
    }
  }

  function getProjectScoreColor(score: number) {
    if (score > 80) {
      return "border-green-600 text-green-600";
    } else if (score >= 70) {
      return "border-yellow-600 text-yellow-600";
    } else if (score >= 50) {
      return "border-yellow-600 text-yellow-600";
    } else if (score >= 30) {
      return "border-yellow-600 text-yellow-600";
    } else {
      return "border-red-600 text-red-600";
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2 pt-2 items-start">
      <div className="border-[1px] sm:order-first order-last border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
        <div className="border-b-[1px] border-neutral-200 dark:border-neutral-900 w-full">
          <div className="flex flex-row gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <IoFlagOutline />
            <span>Project Score</span>
          </div>
          <div className="p-4 flex flex-col items-center gap-2 relative">
            <View.If visible={isProjectNew}>
              <div className="backdrop-blur-sm bg-white/50 dark:bg-black/50 inset-0 absolute z-50 flex justify-center items-center">
                Start logging to see your score.
              </div>
            </View.If>
            <div
              className={
                BuildComponent({
                  name: "Count Up",
                  defaultClasses:
                    "w-24 h-24 font-semibold text-2xl flex items-center justify-center border-4 rounded-full",
                  extraClasses: getProjectScoreColor(projectScore),
                }).classes
              }
            >
              <CountUp end={projectScore} duration={2} />
            </div>
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-row w-full items-center justify-center gap-1">
                <Tooltip
                  outline
                  content={
                    isProjectNew
                      ? "i knew you would check this"
                      : "Project score calculated by (error/total) logs."
                  }
                >
                  <MdInfoOutline size={14} />
                </Tooltip>
                <span
                  className={
                    BuildComponent({
                      name: "Score Message",
                      defaultClasses: "text-xl text-center font-semibold",
                      extraClasses: getProjectScoreColor(projectScore),
                    }).classes
                  }
                >
                  {getProjectScoreMessage(projectScore)}
                </span>
              </div>
              <View viewIf={project?.logCount != 0}>
                <View.If>
                  <span className="text-sm text-neutral-500">
                    {project?.errorCount} error(s) / {project?.logCount} log(s)
                  </span>
                </View.If>
                <View.Else>
                  <span className="text-sm text-neutral-500">No logs yet.</span>
                </View.Else>
              </View>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row justify-between gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <HiOutlineDocument />
              <span>Pages</span>
            </div>
            {/*<Link href={`/project/${id}?page=pages`}>
              <Button
                light="dark:bg-white bg-black dark:text-black"
                className="px-4 text-white"
              >
                <TbListDetails />
                <span className="ml-1">View Pages</span>
              </Button>
            </Link>*/}
          </div>
          <div className="flex flex-col gap-2 p-4 border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <Pages />
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row justify-between gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
            <div className="flex flex-row gap-2 items-center">
              <MdAccessTime />
              <span>Last exceptions</span>
            </div>
            <Link href={`/project/${id}?page=exceptions`}>
              <Button
                light="dark:bg-white bg-black dark:text-black"
                className="px-4  text-white"
              >
                <TbListDetails />
                <span className="ml-1">View All</span>
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <LastExceptions />
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-lg border-[1px] border-neutral-200 dark:border-neutral-900">
        <div className="flex flex-row justify-between p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
          <div className="flex flex-row gap-2 items-center">
            <BsBarChartLine size={14} />
            <span>Statistics</span>
          </div>
          {/*<Link href={`/project/${id}?p=statistics`}>
            <Button
              light="dark:bg-white bg-black dark:text-black"
              className="px-4  text-white"
            >
              <span>View All</span>
            </Button>
                </Link>*/}
        </div>
        <div className="w-full p-4">
          <Statistics />
        </div>
      </div>
    </div>
  );
}
