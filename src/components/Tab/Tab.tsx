import React, { useState, isValidElement } from "react";
import { BuildComponent } from "@/utils/style";

import type { TabProps, TabViewProps } from "./Tab.types";

function Tab({ children, id, className, onTabChange, defaultTab }: TabProps) {
  const [activeTab, setActiveTab] = useState<number>(
    defaultTabStringToIndex(defaultTab)
  );

  function defaultTabStringToIndex(defaultTab?: string): number {
    if (!defaultTab) return 0;
    const index = Array.isArray(children)
      ? children.findIndex((child) => {
          if (!child || !isValidElement(child)) return false;
          const props = child?.props as TabViewProps;
          return props.id === defaultTab;
        })
      : 0;
    // @ts-ignore
    if (children[index]?.props && children[index]?.props?.disabled) return 0;
    if (index === -1) return 0;
    return index;
  }

  function handleTabChange({ index, id }: { index: number; id: string }) {
    setActiveTab(index);
    typeof onTabChange == "function" && onTabChange({ id, index });
  }

  const BuildTab = BuildComponent({
    name: "Tab",
    defaultClasses:
      "w-full pb-[4px] flex flex-row overflow-x-auto overflow-y-hidden relative",
    extraClasses: className,
  });

  if (!Array.isArray(children) || children.length < 2)
    throw new Error("Tab component must have multiple children");

  return (
    <>
      <div className={BuildTab.classes}>
        {Array.isArray(children) &&
          children.map((child, index) => {
            if (!child || !isValidElement(child)) return;
            const props = child.props as TabViewProps;
            return (
              <label
                htmlFor={props.id}
                className="group h-8 flex items-center justify-center relative px-2 cursor-pointer"
                key={props.id}
              >
                <input
                  type="radio"
                  id={props.id}
                  name={id}
                  value={props.id}
                  className="hidden peer"
                  checked={activeTab === index}
                  onChange={() => handleTabChange({ index, id: props.id })}
                  disabled={props?.disabled}
                />
                <div className="z-20 peer-checked:text-black dark:peer-checked:text-white dark:text-neutral-500 peer-disabled:text-neutral-200 dark:peer-disabled:text-neutral-800 dark:hover:text-neutral-400 hover:text-neutral-500 text-neutral-400 break-keep">
                  {activeTab == index
                    ? props.activeTitle
                    : props.nonActiveTitle}
                </div>
                <div className="absolute -bottom-1 left-0 right-0 h-[2px] dark:bg-white bg-black transition-all duration-300 ease-in-out peer-checked:opacity-100 opacity-0" />
              </label>
            );
          })}
      </div>
      {Array.isArray(children) && children[activeTab]}
    </>
  );
}

Tab.TabView = function TabView({ children }: TabViewProps) {
  return <>{children}</>;
};

export default Tab;