export default function LogCardEntry({
  title,
  value,
}: {
  title: string;
  value: string | number | boolean;
}) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-row gap-1 items-center">
        <div>{title}</div>
      </div>
      <div>
        <span className="text-xs whitespace-pre-wrap break-all dark:text-neutral-400 text-neutral-600 bg-neutral-200 dark:bg-neutral-900 px-1 rounded">
          {value}
        </span>
      </div>
    </div>
  );
}
