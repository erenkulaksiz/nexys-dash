import { map_range } from "@/utils/map";

export default function MetricScore({
  minScore,
  maxScore,
  midScore,
  score,
}: {
  minScore: number;
  maxScore: number;
  midScore: number;
  score: number;
}) {
  const range = map_range(score, minScore, maxScore + 5, 0, 200);

  return (
    <div className="flex flex-row w-[200px] h-[20px] rounded-xl relative">
      <div className="w-full bg-red-600 pl-2 text-xs flex items-center">
        {maxScore}
      </div>
      <div className="w-full bg-yellow-600 text-xs flex items-center justify-center">
        {midScore}
      </div>
      <div className="w-full bg-green-600 flex justify-end pr-2 text-xs items-center">
        {minScore}
      </div>
      <div
        className="absolute inset-0 flex items-center"
        style={{
          transform: `translate(${200 - (range > 200 ? 200 : range)}px, -2px)`,
        }}
      >
        <span className="text-lg font-bold">|</span>
        <span className="absolute top-6 dark:bg-neutral-800 px-2 rounded-lg">
          {score || "N/A"}
        </span>
      </div>
    </div>
  );
}
