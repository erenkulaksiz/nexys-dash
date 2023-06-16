import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import View from "@/components/View";
import { useProjectStore } from "@/stores/projectStore";
import { HiDocument } from "react-icons/hi";
import PageLink from "./PageLink";
import PageDetails from "./PageDetails";

export default function Pages() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const project = useProjectStore((state) => state.currentProject);
  //

  useEffect(() => {
    const path = decodeURIComponent(router.query.path?.toString() || "");

    if (path !== selected) {
      setSelected(path ? path : null);
    }
  }, [router.query.path]);

  function onSelect(path: string) {
    setSelected(path);
    router.push(
      `/project/${project?.name}?page=pages&path=${encodeURIComponent(path)}`
    );
  }

  function onBack() {
    router.push(`/project/${project?.name}?page=pages`);
    setSelected(null);
  }

  return (
    <View viewIf={project?.logPaths && project?.logPaths?.length > 2}>
      <View.If>
        <div className="grid grid-cols-1 gap-2 py-2 pt-2 items-start">
          <View viewIf={selected == null}>
            <View.If>
              <div className="border-[1px] sm:order-first order-last border-neutral-200 dark:border-neutral-900 rounded-lg items-start flex flex-col">
                <div className="w-full">
                  <div className="flex flex-row gap-2 items-center p-4 text-lg font-semibold border-b-[1px] border-neutral-200 dark:border-neutral-900">
                    <HiDocument />
                    <span>Pages</span>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    {project?.logPaths?.map((path, index) => (
                      <PageLink path={path} onSelect={onSelect} key={index} />
                    ))}
                  </div>
                </div>
              </div>
            </View.If>
            <View.Else>
              <PageDetails selected={selected} onBack={onBack} />
            </View.Else>
          </View>
        </div>
      </View.If>
      <View.Else>
        <div className="mt-2">
          Need atleast different 2 page logs to view this tab.
        </div>
      </View.Else>
    </View>
  );
}
