import { useEffect, useRef } from "react";

import type { MagicBorderProps } from "./MagicBorder.types";

export default function MagicBorder({
  children,
  circleSize = 600,
}: MagicBorderProps) {
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!borderRef.current) return;
    borderRef.current.style.setProperty("--circle-size", `${circleSize}px`);

    const onMouseMove = (e: MouseEvent) => {
      if (!borderRef.current) return;
      const { clientX, clientY } = e;
      const { offsetLeft, offsetTop } = borderRef.current;

      const x = clientX - offsetLeft;
      const y = clientY - offsetTop;

      borderRef.current.style.setProperty("--x", `${x}px`);
      borderRef.current.style.setProperty("--y", `${y}px`);
    };

    borderRef.current?.addEventListener("mousemove", onMouseMove);
    return () => {
      borderRef.current?.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      className="p-[1px] rounded-lg dark:bg-dark-border bg-neutral-200 hover:bg-magical-radial dark:hover:bg-dark-magical-radial"
      ref={borderRef}
    >
      {children}
    </div>
  );
}
