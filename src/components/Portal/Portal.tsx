import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

import { isClient } from "@/utils";
import type { PortalProps } from "./Portal.types";

export default function Portal({
  children,
  parent,
  className,
  portalName,
}: PortalProps) {
  const el = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    if (!el) return;
    if (!isClient()) return;

    const target = parent && parent["appendChild"] ? parent : document.body;
    const classList = [portalName];

    if (typeof className != "undefined") {
      className.split(" ").forEach((item) => classList.push(item));
    }

    classList.forEach((item) => el.classList.add(item ?? ""));

    target.appendChild(el);
    return () => {
      target.removeChild(el);
    };
  }, [el]);

  return createPortal(children, el);
}
