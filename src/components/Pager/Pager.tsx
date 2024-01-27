import { MdArrowLeft, MdArrowRight } from "react-icons/md";

import Button from "@/components/Button";
import { BuildComponent } from "@/utils/style";
import type { PagerProps } from "./Pager.types";

export default function Pager({
  currentPage,
  totalPages,
  onPageClick,
  onPreviousClick,
  onNextClick,
  perPage,
  className,
}: PagerProps) {
  return (
    <div
      className={
        BuildComponent({
          name: "Pager",
          defaultClasses:
            "flex flex-row gap-1 w-full flex-wrap dark:text-dark-text",
          extraClasses: className,
        }).classes
      }
    >
      <Button onClick={onPreviousClick} className="w-8">
        <MdArrowLeft size={24} />
      </Button>

      <Button
        className={
          BuildComponent({
            name: "Pager Button",
            defaultClasses: "w-8",
            conditionalClasses: [{ true: "dark:bg-darker bg-neutral-200" }],
            selectedClasses: [currentPage == 0],
          }).classes
        }
        onClick={() => onPageClick(0)}
      >
        1
      </Button>

      {Array.from({ length: totalPages }).map((_, index) => {
        if (index > currentPage + perPage) return;
        if (index < currentPage - perPage) return;
        if (index == totalPages - 1) return;
        if (index == 0) return;
        return (
          <Button
            key={`pager-button-${index}`}
            className={
              BuildComponent({
                name: "Pager Button",
                defaultClasses: "w-auto min-w-[2rem] p-2",
                conditionalClasses: [{ true: "dark:bg-darker bg-neutral-200" }],
                selectedClasses: [currentPage == index],
              }).classes
            }
            onClick={() =>
              typeof onPageClick == "function" && onPageClick(index)
            }
          >
            {index + 1}
          </Button>
        );
      })}

      <Button
        className={
          BuildComponent({
            name: "Pager Button",
            defaultClasses: "w-auto min-w-[2rem] p-2",
            conditionalClasses: [{ true: "dark:bg-darker bg-neutral-200" }],
            selectedClasses: [currentPage == totalPages - 1],
          }).classes
        }
        onClick={() => onPageClick(totalPages - 1)}
      >
        {totalPages}
      </Button>

      <Button onClick={onNextClick} className="w-8">
        <MdArrowRight size={24} />
      </Button>
    </div>
  );
}
