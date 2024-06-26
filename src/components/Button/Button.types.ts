import { ReactNode } from "react";

export interface ButtonProps {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  gradient?: boolean | string;
  light?: boolean | string;
  size?: "sm" | "lg" | "xl" | string;
  rounded?: boolean | string;
  fullWidth?: boolean | string;
  ring?: boolean | string;
  loading?: boolean | string;
  form?: string;
  as?: string;
  onClick?: () => void;
  title?: string;
  type?: HTMLInputElement["type"];
  testId?: string;
  disabled?: boolean;
  center?: boolean;
}
