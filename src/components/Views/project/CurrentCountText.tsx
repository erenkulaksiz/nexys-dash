export default function CurrentLogCountText({
  count,
  type,
}: {
  count: number;
  type: string;
}) {
  if (!count) return <></>;

  return (
    <div className="text-sm sm:mt-0 mt-2 dark:text-dark-text">
      Total
      <span className="ml-1 text-xs whitespace-pre-wrap break-all dark:text-dark-accent text-neutral-600 bg-neutral-200 dark:bg-darker px-1 rounded-full">
        {count}
      </span>{" "}
      {type}.
    </div>
  );
}
