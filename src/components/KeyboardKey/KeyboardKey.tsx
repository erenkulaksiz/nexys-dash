import View from "@/components/View";
import type { KeyboardKeyProps } from "./KeyboardKey.types";

export default function KeyboardKey({ icon, _key: key }: KeyboardKeyProps) {
  return (
    <div className="p-[4px] py-0 dark:bg-darker/50 border-b-[2px] dark:border-b-dark-accent border-b-neutral-300 bg-neutral-100 rounded flex flex-row items-center gap-1 text-sm">
      <View.If visible={!!icon}>
        <div>{icon}</div>
      </View.If>
      <View.If visible={!!key}>
        <div>{key}</div>
      </View.If>
    </div>
  );
}
