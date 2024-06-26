import Link from "next/link";
import { CiShare1 } from "react-icons/ci";

import Button from "@/components/Button";
import Container from "@/components/Container";
import View from "@/components/View";
import Avatar from "@/components/Avatar";
import { useProjectStore } from "@/stores/projectStore";

export default function Header() {
  const project = useProjectStore((state) => state.currentProject);
  const isProjectNew = project?.logUsage ? project?.logUsage <= 10 : true;
  const loading = useProjectStore((state) => state.loading);

  return (
    <>
      <div className="flex z-40 w-full flex-row gap-2 items-end py-4 border-b-[1px] border-neutral-200 dark:border-dark-border">
        <Container className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <View viewIf={loading}>
              <View.If>
                <div className="animate-pulse flex flex-col gap-2">
                  <div className="h-5 bg-neutral-100 dark:bg-darker w-48"></div>
                  <div className="h-2.5 bg-neutral-100 dark:bg-darker w-32"></div>
                </div>
              </View.If>
              <View.Else>
                <div className="flex flex-row items-center gap-3">
                  <Avatar size="2xl" src="/images/avatar.png" />
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-semibold dark:text-dark-text">
                      {project?.name}
                    </h1>
                    <h2 className="text-neutral-500 dark:text-dark-accent">
                      {project?.domain}
                    </h2>
                  </div>
                </div>
              </View.Else>
            </View>
            <View.If hidden={loading}>
              <div
                className={
                  project?.verified
                    ? "bg-green-600 px-2 rounded text-xs text-white"
                    : "bg-red-600 px-2 rounded text-xs text-white"
                }
              >
                <View viewIf={project?.verified}>
                  <View.If>
                    <span>Verified</span>
                  </View.If>
                  <View.Else>
                    <span>Unverified</span>
                  </View.Else>
                </View>
              </div>
            </View.If>
          </div>
          <View.If hidden={loading}>
            <Link href={`https://${project?.domain}` ?? ""} target="_blank">
              <Button
                light="dark:bg-dark-text bg-black dark:text-black"
                className="px-4 text-white dark:text-dark-text"
              >
                <CiShare1 className="mr-1" />
                <span>Visit</span>
              </Button>
            </Link>
          </View.If>
        </Container>
      </div>
      <View.If visible={isProjectNew && !loading}>
        <div className="w-full p-2 py-4 border-b-[1px] border-neutral-200 dark:border-dark-border">
          <Container>
            <div className="flex flex-row gap-4 items-center">
              <Link href="https://docs.nexys.app/installation" target="_blank">
                <Button
                  light="dark:bg-dark-text bg-black dark:text-black"
                  className="px-4 text-white"
                >
                  <CiShare1 className="mr-1" />
                  <span>Documentation</span>
                </Button>
              </Link>
              <div className="flex flex-col">
                <div className="text-2xl font-semibold dark:text-dark-text">
                  {"Let's get you started with Nexys."}
                </div>
                <div className="dark:text-dark-accent">
                  {"Read documents, push your first log to get started."}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </View.If>
    </>
  );
}
