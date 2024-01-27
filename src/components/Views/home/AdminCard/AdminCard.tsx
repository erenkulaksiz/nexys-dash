import Link from "next/link";

export default function AdminCard() {
  return (
    <Link href="/admin">
      <div className="flex flex-col group items-center justify-center relative dark:bg-dark bg-white rounded-lg p-4 h-32 cursor-pointer border-[1px] border-neutral-200 dark:border-dark-border hover:dark:border-dark-accent hover:border-neutral-400">
        <div className="text-center">Admin</div>
      </div>
    </Link>
  );
}
