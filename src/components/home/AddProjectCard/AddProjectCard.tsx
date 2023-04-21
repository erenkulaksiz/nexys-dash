import Link from "next/link";

import { MdAdd } from "react-icons/md";

export function AddProjectCard() {
  return (
    <Link href="/new">
      <div className="flex flex-col group items-center justify-center relative dark:bg-black bg-white rounded-lg p-4 h-32 cursor-pointer border-[1px] border-neutral-200 dark:border-neutral-900 hover:dark:border-neutral-300 hover:border-neutral-400">
        <MdAdd
          size={24}
          className="translate-y-3 group-hover:translate-y-1 transition-all"
        />
        <div className="text-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
          New Project
        </div>
      </div>
    </Link>
  );
}
