export default function CurrentLogCountText({
  count,
  type,
}: {
  count: number;
  type: string;
}) {
  return (
    <div className="text-sm sm:mt-0 mt-2">
      Total
      <span className="ml-1 text-xs whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-1 rounded-full">
        {count}
      </span>{" "}
      {type}.
    </div>
  );
}
