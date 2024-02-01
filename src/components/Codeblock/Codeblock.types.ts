import type { ReactNode } from "react";

export interface CodeblockProps {
  children?: ReactNode;
  data?: string;
  disableCopy?: boolean;
}
