import { BuildComponent } from "@/utils/style";
import type { TooltipProps } from "./Tooltip.types";

export function BuildAllContainer({ allContainerClassName }: TooltipProps) {
  return BuildComponent({
    name: "Tooltip All Container",
    defaultClasses: "relative flex justify-center items-center",
    extraClasses: allContainerClassName,
  });
}

export function BuildPortal({
  direction = "top",
  blockContent = true,
}: TooltipProps) {
  return BuildComponent({
    name: "Tooltip Portal",
    defaultClasses: "absolute",
    conditionalClasses: [
      {
        top: "bottom-[calc(100%+5px)]",
        right: "left-[calc(100%+5px)]",
        left: "right-[calc(100%+5px)]",
        bottom: "top-[calc(100%+5px)]",
        workspaceSidebarRight: "left-[calc(100%-40px)]",
      },
      {
        true: "pointer-events-none",
      },
    ],
    selectedClasses: [direction, blockContent],
  });
}

export function BuildArrow({ direction = "top", outline }: TooltipProps) {
  const ArrowDirectionStyles = {
    top: "border-r-[1px] border-r-neutral-600/20 border-b-[1px] border-b-neutral-600/20",
    right:
      "border-l-[1px] border-l-neutral-600/20 border-b-[1px] border-b-neutral-600/20",
    left: "border-t-[1px] border-t-neutral-600/20 border-r-[1px] border-r-neutral-600/20",
    bottom:
      "border-t-[1px] border-t-neutral-600/20 border-l-[1px] border-l-neutral-600/20",
  };

  return BuildComponent({
    name: "Tooltip Arrow",
    defaultClasses:
      "w-2 -z-40 h-2 bg-white dark:bg-neutral-800 absolute rotate-45",
    conditionalClasses: [
      {
        top: "-bottom-1",
        right: "-left-1",
        left: "-right-1",
        bottom: "-top-1",
      },
      {
        true: ArrowDirectionStyles[direction] ?? "border-none",
        default: outline,
      },
    ],
    selectedClasses: [direction, outline],
  });
}
