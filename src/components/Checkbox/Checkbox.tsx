import { FiCheck } from "react-icons/fi";
import { BuildComponent } from "@/utils/style";
import View from "@/components/View";
import type { CheckboxProps } from "./Checkbox.types";

export default function Checkbox({
  checked,
  onChange,
  className,
  children,
  id,
}: CheckboxProps) {
  const BuildCheckbox = BuildComponent({
    name: "Checkbox",
    defaultClasses: "flex flex-row group",
    extraClasses: className,
  });

  const BuildCheckboxInner = BuildComponent({
    name: "Checkbox Inner",
    defaultClasses:
      "relative h-4 w-4 outline-none group-focus:outline-2 group-focus:outline-blue-500/50 transition-colors ease-in-out flex items-center text-xs justify-center rounded border-[1px] border-neutral-200 dark:border-neutral-900",
    extraClasses: className,
    conditionalClasses: [
      {
        true: "bg-green-500 dark:bg-green-800 border-[2px]",
      },
      { true: "mr-2" },
    ],
    selectedClasses: [checked, children ? true : false],
  });

  return (
    <div className={BuildCheckbox.classes}>
      <input
        className="hidden"
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
        id={id}
      />
      <View.If visible={!!children}>
        <label
          className="flex flex-row items-center cursor-pointer group"
          htmlFor={id}
        >
          <div className={BuildCheckboxInner.classes}>
            <View.If visible={checked}>
              <FiCheck size={14} className="text-white dark:text-black" />
            </View.If>
          </div>
          {children}
        </label>
      </View.If>
    </div>
  );
}
