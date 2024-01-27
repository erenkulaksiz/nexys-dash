import Link from "next/link";

import { MdAdd } from "react-icons/md";

export default function AddProjectCard() {
  return (
    <Link href="/new">
      <div className="dark:text-dark-text flex flex-col group items-center justify-center relative rounded-lg p-4 h-32 cursor-pointer border-[1px] border-neutral-200 dark:border-dark-border hover:dark:border-dark-accent hover:border-neutral-400">
        <MdAdd
          size={24}
          className="translate-y-3 group-hover:translate-y-1 transition-all dark:fill-dark-text"
        />
        <div className="text-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
          New Project
        </div>
      </div>
    </Link>
  );
}
