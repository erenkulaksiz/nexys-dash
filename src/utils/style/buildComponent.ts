import { twMerge } from "tailwind-merge";

interface BuildComponentTypes {
  name?: string;
  defaultClasses?: string;
  extraClasses?: string;
  conditionalClasses?: Array<{
    [key: string]: string | boolean | number | undefined;
  }>;
  selectedClasses?: Array<string | boolean | undefined>;
}

export function BuildComponent({
  name = "Default Component", // The component name we are going to built. eg: 'Button' - string
  defaultClasses, // Default classes the component will recieve. 'bg-white' - string
  extraClasses, // Extra classes that component recieve, e.g. button but blue - string
  conditionalClasses, // The classes that component potentially recieve - array[object]
  selectedClasses, // The selected classes that component has - array[string]
}: BuildComponentTypes) {
  let allClasses = ""; // set initial data. eg: 'bg-white'
  if (defaultClasses) allClasses += defaultClasses;
  if (extraClasses) {
    allClasses = twMerge(allClasses, extraClasses);
  }
  if (conditionalClasses) {
    if (selectedClasses) {
      selectedClasses.forEach(
        (selectedClass: string | boolean | undefined, index: number) => {
          if (typeof conditionalClasses[index] != "undefined") {
            const selectedObj = conditionalClasses[index];
            if (typeof selectedClass != "undefined") {
              if (selectedObj[selectedClass.toString()]) {
                allClasses = twMerge(
                  allClasses,
                  // @ts-ignore
                  conditionalClasses[index][selectedClass.toString()]
                );
              } else {
                if (conditionalClasses[index]["default"]) {
                  allClasses = twMerge(
                    allClasses,
                    // @ts-ignore
                    conditionalClasses[index]["default"]
                  );
                }
              }
            }
          }
        }
      );
    }
  }

  return {
    name,
    classes: allClasses,
  };
}
