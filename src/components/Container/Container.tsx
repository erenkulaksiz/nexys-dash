import { BuildComponent } from "@/utils/style";
import type { ContainerProps } from "./Container.types";

export default function Container({
  children,
  className,
  hidden,
}: ContainerProps) {
  if (hidden) return null;

  return (
    <div
      className={
        BuildComponent({
          name: "Container",
          defaultClasses:
            "container break-words px-4 xl:px-32 w-full mx-auto z-10",
          extraClasses: className,
        }).classes
      }
    >
      {children}
    </div>
  );
}
