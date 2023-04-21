import React, { useState, useRef, useEffect } from "react";

import Portal from "@/components/Portal";
import { BuildComponent } from "@/utils/style";
import { BuildAllContainer, BuildArrow, BuildPortal } from "./BuildComponent";
import type { TooltipProps } from "./Tooltip.types";

export default function Tooltip({
  children,
  content,
  allContainerClassName,
  containerClassName,
  hideArrow = false,
  direction = "top",
  animated = true,
  blockContent = true, // block pointer events
  useFocus = false, // uses focus instead of using hover
  style,
  noPadding = false,
  outline = false,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setShow(true);
    }
  }, [visible]);

  function BuildTooltipContainer({
    containerClassName,
    direction = "top",
    noPadding = false,
    outline = false,
  }: TooltipProps) {
    const anims = {
      top: {
        hidden: "top-0 translate-y-2 opacity-0",
        show: "top-0 translate-y-0 opacity-100",
      },
      right: {
        hidden: "right-0 translate-x-2 opacity-0",
        show: "right-0 translate-x-0 opacity-100",
      },
      bottom: {
        hidden: "bottom-0 translate-y-2 opacity-0",
        show: "bottom-0 translate-y-0 opacity-100",
      },
      left: {
        hidden: "left-0 translate-x-2 opacity-0",
        show: "left-0 translate-x-0 opacity-100",
      },
    };

    const currAnim =
      anims[direction as keyof TooltipProps["direction"]][
        visible ? "show" : "hidden"
      ];

    return BuildComponent({
      name: "Tooltip Container",
      defaultClasses:
        "transition-all duration-200 ease-in-out shadow-xl shadow-neutral-600/30 z-50 relative bg-white dark:bg-neutral-800 dark:shadow-black/60 shadow-neutral-800/30 whitespace-nowrap flex items-center justify-center rounded-xl text-sm shadow-xl text-black dark:text-white",
      extraClasses: containerClassName,
      conditionalClasses: [
        {
          top: currAnim,
          right: currAnim,
          left: currAnim,
          bottom: currAnim,
        },
        {
          false: "px-3 py-1",
        },
        {
          true: "border-[1px] border-neutral-600/20",
          default: outline,
        },
      ],
      selectedClasses: [direction, noPadding, outline],
    });
  }

  return (
    <div
      onMouseEnter={() => !useFocus && setVisible(true)}
      onMouseLeave={() => !useFocus && setVisible(false)}
      onFocus={() => useFocus && setVisible(true)}
      onBlur={() => useFocus && setVisible(false)}
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={BuildAllContainer({ allContainerClassName }).classes}
      style={style}
    >
      {children}
      {show && content && (
        <Portal
          parent={containerRef.current}
          className={BuildPortal({ direction, blockContent }).classes}
          portalName="notal-tooltip"
        >
          <div
            className={
              BuildTooltipContainer({
                containerClassName,
                direction,
                noPadding,
                outline,
              }).classes
            }
          >
            {content}
            {!hideArrow && (
              <div className={BuildArrow({ direction, outline }).classes} />
            )}
          </div>
        </Portal>
      )}
    </div>
  );
}
