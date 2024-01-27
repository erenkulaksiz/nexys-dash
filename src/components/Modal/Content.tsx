import { BuildComponent } from "@/utils/style";
import type { ReactNode } from "react";

export default function Content({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const BuildModalContent = BuildComponent({
    name: "Modal Content",
    defaultClasses:
      "md:w-[700px] lg:w-[900px] w-full h-full md:h-auto z-50 relative flex flex-col shadow-2xl p-4 m-auto backdrop-brightness-75 dark:bg-neutral-900 bg-white",
    extraClasses: className,
  });

  return (
    <div
      className={BuildModalContent.classes}
      tabIndex={-1}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
