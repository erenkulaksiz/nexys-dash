import { BuildComponent } from "@/utils/style/buildComponent";
import View from "@/components/View";
import type { SelectProps } from "./Select.types";

export default function Select({
  options,
  onChange,
  value,
  className,
  id,
}: SelectProps) {
  const BuildSelect = BuildComponent({
    name: "Select",
    defaultClasses:
      "px-2 outline-none focus:outline-2 focus:outline-blue-500/50 border-[1px] border-solid border-neutral-200 dark:border-neutral-900 appearance-none flex text-base font-normal text-gray-700 dark:text-white bg-white dark:bg-black bg-clip-padding bg-no-repeat rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
    extraClasses: className,
  });

  return (
    <select
      onChange={(e) => onChange(e)}
      value={value}
      className={BuildSelect.classes}
      id={id}
    >
      <View.If hidden={!options}>
        {options.map((element, index) => (
          <option key={index} value={element.id} disabled={element.disabled}>
            {element.text}
          </option>
        ))}
      </View.If>
    </select>
  );
}
