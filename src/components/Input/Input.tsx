import { useState } from "react";

import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { BuildComponent } from "@/utils/style/buildComponent";
import type { InputProps } from "./Input.types";

export default function Input({
  onChange,
  onEnterPress,
  value,
  fullWidth = false,
  placeholder,
  disabled = false,
  containerClassName,
  className,
  height = "h-11",
  textarea = false,
  rounded = true,
  autoFocus = false,
  required = false,
  icon,
  id,
  maxLength,
  passwordVisibility = false,
  type = "text",
}: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const InputElement = textarea ? "textarea" : "input";

  const BuildInputContainer = BuildComponent({
    name: "Input Container",
    defaultClasses: "flex flex-row relative items-center dark:text-white",
    extraClasses: containerClassName,
    conditionalClasses: [
      {
        true: "w-full",
      },
      {
        true: "h-11",
        default: height,
      },
      {
        true: "rounded-lg",
        false: rounded,
      },
    ],
    selectedClasses: [
      fullWidth,
      height == "h-11" && true,
      rounded == true ? true : false,
    ],
  });

  const BuildInput = BuildComponent({
    name: "Input",
    defaultClasses:
      "outline-none focus:outline-2 focus:outline-blue-500/50 w-full h-full px-2 border-2 border-neutral-300/30 dark:border-neutral-900/50 dark:bg-black placeholder:text-neutral-400 placeholder:text-sm",
    extraClasses: className,
    conditionalClasses: [
      {
        true: "rounded-lg",
        false: rounded,
      },
      {
        true: "resize-none",
      },
      {
        true: "pr-8",
      },
      {
        true: "pl-[26px]",
      },
    ],
    selectedClasses: [
      rounded == true ? true : false,
      textarea,
      passwordVisibility,
      icon ? true : false,
    ],
  });

  return (
    <div className={BuildInputContainer.classes}>
      {icon && (
        <span
          className="z-20 absolute left-2 fill-inherit"
          style={{ transform: "scale(0.8)" }}
        >
          {icon}
        </span>
      )}
      <InputElement
        id={id}
        required={required}
        value={value}
        disabled={disabled}
        type={passwordVisible ? "text" : type}
        key={id}
        autoFocus={autoFocus}
        onChange={(e) => typeof onChange == "function" && onChange(e)}
        className={BuildInput.classes}
        placeholder={placeholder}
        maxLength={maxLength}
        onKeyDown={(e) => {
          if (e.key != "Enter") return;

          if (typeof onEnterPress === "function") {
            onEnterPress(e);
          }
        }}
      />
      {passwordVisibility && (
        <button
          className="z-20 absolute -right-2 p-4 fill-inherit"
          style={{ transform: "scale(0.7)" }}
          onClick={() => setPasswordVisible(!passwordVisible)}
          type="button"
        >
          {passwordVisible ? (
            <HiOutlineEyeOff size={24} />
          ) : (
            <HiOutlineEye size={24} />
          )}
        </button>
      )}
    </div>
  );
}
