import { createElement } from "react";

import { twMerge } from "tailwind-merge";
import View from "@/components/View";
import Loading from "@/components/Loading";
import { BuildComponent, conditionalClass } from "@/utils/style";
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
  center = true,
  ...props
}: ButtonProps) {
  const iconSpace = conditionalClass({
    keys: {
      default: "left-4",
      md: "left-2",
    },
    selected: size,
  });

  const centerButton = conditionalClass({
    keys: {
      true: "mx-auto flex flex-row items-center",
      false: "flex flex-row items-center w-full",
    },
    selected: center.toString(),
  });

  const iconClasses = twMerge("absolute left-0", iconSpace);

  const BuildButton = BuildComponent({
    name: "Button",
    defaultClasses:
      "cursor-pointer z-10 overflow-hidden hover:opacity-80 active:opacity-80 flex flex-row items-center relative active:scale-95 transition-all duration-75 font-semibold text-sm dark:text-dark-text",
    extraClasses: className,
    conditionalClasses: [
      {
        default: fullWidth,
        true: "w-full",
      },
      {
        default: rounded,
        "not-rounded": "rounded-none",
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
          "hover:bg-neutral-100/50 hover:dark:bg-darker/50 outline-none border-[1px] border-neutral-200 dark:border-dark-border",
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
      <View.If hidden={!icon}>
        <div className={iconClasses}>{icon}</div>
      </View.If>
      <div className={centerButton}>{children}</div>
      <View.If visible={!!loading}>
        <div className="absolute left-0 right-0 bottom-0 top-0 dark:bg-darker/90 bg-neutral-200/50 flex items-center justify-center">
          <Loading />
        </div>
      </View.If>
    </ButtonEl>
  );
}
