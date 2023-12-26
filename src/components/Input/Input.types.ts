import type { ChangeEvent, KeyboardEvent, FocusEvent } from "react";

export interface InputProps {
  onChange?: (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  value?: string;
  onEnterPress?: (
    event: KeyboardEvent<HTMLInputElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  onFocus?: (
    event: FocusEvent<HTMLInputElement> | FocusEvent<HTMLTextAreaElement>
  ) => void;
  onKeyDown?: (
    event: KeyboardEvent<HTMLInputElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  fullWidth?: boolean;
  containerClassName?: string;
  className?: string;
  height?: string; // h-10
  textarea?: boolean;
  rounded?: string | boolean;
  autoFocus?: boolean;
  icon?: React.ReactNode;
  id?: string;
  maxLength?: number;
  password?: boolean;
  passwordVisibility?: boolean;
  type?: HTMLInputElement["type"];
  required?: boolean;
  disabled?: boolean;
}
