import { BuildComponent } from "@/utils/style";
import type { MouseEvent, ReactNode } from "react";

export default function Backdrop({
  children,
  className,
  onClose,
}: {
  children: ReactNode;
  className?: string;
  onClose: (e: MouseEvent<HTMLDivElement>) => void;
}) {
  const BuildModalBackdrop = BuildComponent({
    name: "Modal Backdrop",
    defaultClasses:
      "fixed top-0 right-0 bottom-0 left-0 flex z-50 overflow-auto overflow-x-hidden items-center justify-center bg-black/60",
    extraClasses: className,
  });

  return (
    <div
      className={BuildModalBackdrop.classes}
      tabIndex={-1}
      onClick={(e: MouseEvent<HTMLDivElement>) => onClose(e)}
    >
      {children}
    </div>
  );
}
