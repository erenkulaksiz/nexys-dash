import { ReactNode } from "react";

export interface TooltipProps {
  children?: ReactNode;
  content?: ReactNode | string;
  allContainerClassName?: string;
  containerClassName?: string;
  hideArrow?: boolean;
  direction?: "top" | "bottom" | "right" | "left";
  animated?: boolean;
  blockContent?: boolean;
  closeAuto?: boolean;
  useFocus?: boolean;
  style?: {
    [key: string]: string | number;
  };
  noPadding?: boolean;
  outline?: boolean;
}
