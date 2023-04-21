import { createElement } from "react";

import { BuildComponent, allClass, conditionalClass } from "@/utils/style";
import Loading from "@/components/Loading";
import type { ButtonProps } from "./Button.types";

export default function Button({
  children,
  className,
  icon,
  onClick,
  gradient = false,
  light = false,
  size = "md",
  rounded = false,
  fullWidth = false,
  ring = true,
  loading = false,
  form,
  as = "button",
  title,
  type,
  disabled,
  ...props
}: ButtonProps) {
  const iconSpace = conditionalClass({
    keys: {
      default: "left-4",
      md: "left-2",
    },
    selected: size,
  });

  const iconClasses = allClass({
    defaultClasses: "absolute left-0",
    conditions: [iconSpace],
  });

  const BuildButton = BuildComponent({
    name: "Button",
    defaultClasses:
      "cursor-pointer z-10 overflow-hidden hover:opacity-80 active:opacity-80 flex flex-row items-center relative active:scale-95 transition-all duration-75 font-semibold text-sm",
    extraClasses: className,
    conditionalClasses: [
      {
        default: fullWidth,
        true: "w-full",
      },
      {
        default: rounded,
        false: "rounded-lg",
        true: "rounded-full",
      },
      {
        true: "bg-gradient-to-r from-sky-600 to-violet-700",
      },
      {
        default: size,
        sm: "h-4",
        md: "h-8",
        lg: "h-12",
        xl: "h-16",
      },
      {
        default: light,
        false:
          "hover:bg-neutral-100/50 hover:dark:bg-neutral-800 outline-none border-[1px] border-neutral-200 dark:border-neutral-900", //also remove ring
        true: "bg-transparent hover:bg-transparent active:dark:bg-neutral-700/30 active:bg-neutral-200/50",
      },
      {
        default: ring,
        true: "focus:outline-2 focus:outline-blue-500/50",
      },
    ],
    selectedClasses: [fullWidth, rounded, gradient, size, light, ring],
  });

  const ButtonEl = ({ children, ...props }: ButtonProps) => {
    return createElement(as, props, children);
  };

  return (
    <ButtonEl
      onClick={onClick}
      className={BuildButton.classes}
      form={form}
      title={title}
      type={type}
      disabled={disabled}
      {...props}
    >
      {icon && <div className={iconClasses}>{icon}</div>}
      <div className="mx-auto flex flex-row items-center">{children}</div>
      {loading && (
        <div className="absolute left-0 right-0 bottom-0 top-0 dark:bg-neutral-900/90 bg-neutral-200/50 flex items-center justify-center">
          <Loading />
        </div>
      )}
    </ButtonEl>
  );
}
