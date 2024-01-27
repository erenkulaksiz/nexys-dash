import CountUp from "react-countup";
import { BiUpArrowAlt, BiDownArrowAlt } from "react-icons/bi";
import View from "@/components/View";
import Tooltip from "@/components/Tooltip";
import type { ReactNode } from "react";

export default function Metric({
  title,
  smallTitle,
  type,
  value,
  decimals = 2,
  arrow = null,
  tooltipContent = null,
}: {
  title: string;
  smallTitle?: string;
  type?: string;
  value: number;
  decimals?: number;
  arrow?: "up" | "down" | null;
  tooltipContent?: string | ReactNode;
}) {
  return (
    <Tooltip
      outline
      content={tooltipContent}
      allContainerClassName="border-[1px] border-neutral-200 dark:border-dark-border rounded-lg items-start flex flex-col"
    >
      <div className="border-b-[1px] gap-0 sm:gap-1 w-full border-neutral-200 dark:border-dark-border flex sm:flex-row flex-col items-start sm:items-center p-2 text-lg sm:text-xl font-semibold">
        <span>{title}</span>
        <View.If visible={!!smallTitle}>
          <span className="text-xs text-neutral-500">{smallTitle}</span>
        </View.If>
      </div>
      <div className="flex flex-row p-2 gap-1 items-end">
        <View.If visible={arrow === "up"}>
          <div className="h-full flex items-center">
            <BiUpArrowAlt className="text-green-600" size={24} />
          </div>
        </View.If>
        <View.If visible={arrow === "down"}>
          <div className="h-full flex items-center">
            <BiDownArrowAlt className="text-red-600" size={24} />
          </div>
        </View.If>
        <CountUp
          end={value}
          duration={2}
          decimals={decimals}
          separator=""
          className="text-2xl sm:text-4xl font-semibold"
        />
        <View.If visible={!!type}>
          <div className="text-neutral-500">{type}</div>
        </View.If>
      </div>
    </Tooltip>
  );
}
