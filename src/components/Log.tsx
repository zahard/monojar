import { Spinner } from "./Spinner";

export function ProgressLog({
  logs,
  showLoading,
  waitTime = 0,
}: {
  logs: string[];
  showLoading: boolean;
  waitTime?: number;
}) {
  return (
    <div className="bg-gray-800 text-neutral-200 font-mono p-3 mt-4 text-xs rounded-md relative min-h-20">
      {logs.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      {showLoading && (
        <div className="absolute top-0 right-0 p-2">
          <Spinner />
          {waitTime > 0 && (
            <div className="absolute text-sm w-full h-full flex top-0 left-0 items-center justify-center">
              {waitTime}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
