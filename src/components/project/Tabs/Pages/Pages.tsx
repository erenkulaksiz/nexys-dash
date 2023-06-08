import Tab from "@/components/Tab";
import View from "@/components/View";
import { useProjectStore } from "@/stores/projectStore";

export default function Pages() {
  const project = useProjectStore((state) => state.currentProject);

  return (
    <View viewIf={project?.logPaths && project?.logPaths?.length > 2}>
      <View.If>
        <Tab id="pages">
          {project?.logPaths?.map((page) => (
            <Tab.TabView
              key={page._id}
              activeTitle={page._id}
              nonActiveTitle={page._id}
              id={page._id}
            >
              <div>test1</div>
            </Tab.TabView>
          ))}
        </Tab>
      </View.If>
      <View.Else>
        <div className="mt-2">
          Need atleast different 2 page logs to view this tab.
        </div>
      </View.Else>
    </View>
  );
}
