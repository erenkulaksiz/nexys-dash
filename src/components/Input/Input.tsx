import { useState } from "react";

import View from "@/components/View";
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
  onFocus,
  onKeyDown,
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
    selectedClasses: [fullWidth, height == "h-11" ? true : false, !!rounded],
  });

  const BuildInput = BuildComponent({
    name: "Input",
    defaultClasses:
      "outline-none focus:outline-2 focus:outline-blue-500/50 w-full h-full px-2 border-[1px] border-neutral-200 dark:border-neutral-900 dark:bg-black placeholder:text-neutral-400 placeholder:text-sm",
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
    ],
    selectedClasses: [
      rounded == true ? true : false,
      textarea,
      passwordVisibility,
    ],
  });

  return (
    <div className={BuildInputContainer.classes}>
      <View.If visible={!!icon}>
        <span
          className="z-20 absolute left-2 fill-inherit"
          style={{ transform: "scale(0.8)" }}
        >
          {icon}
        </span>
      </View.If>
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
          typeof onKeyDown == "function" && onKeyDown(e);
          if (e.key != "Enter") return;

          if (typeof onEnterPress === "function") {
            onEnterPress(e);
          }
        }}
        onFocus={(event) => typeof onFocus == "function" && onFocus(event)}
      />
      <View.If visible={passwordVisibility}>
        <button
          className="z-20 absolute -right-2 p-4 fill-inherit"
          style={{ transform: "scale(0.7)" }}
          onClick={() => setPasswordVisible(!passwordVisible)}
          type="button"
        >
          <View viewIf={passwordVisible}>
            <View.If>
              <HiOutlineEyeOff size={24} />
            </View.If>
            <View.Else>
              <HiOutlineEye size={24} />
            </View.Else>
          </View>
        </button>
      </View.If>
    </div>
  );
}
