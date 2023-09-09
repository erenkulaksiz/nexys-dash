import Link from "next/link";

export default function AdminCard() {
  return (
    <Link href="/admin">
      <div className="flex flex-col group items-center justify-center relative dark:bg-black bg-white rounded-lg p-4 h-32 cursor-pointer border-[1px] border-neutral-200 dark:border-neutral-900 hover:dark:border-neutral-300 hover:border-neutral-400">
        <div className="text-center">Admin</div>
      </div>
    </Link>
  );
}
