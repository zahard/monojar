export function Step({
  title,
  step,
  active = false,
  completed = false,
}: {
  step: string;
  title: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div
      className={`${
        active
          ? "border-orange-500 text-orange-500"
          : "border-slate-500 text-slate-200 hidden md:flex"
      } ${completed ? "opacity-25" : ""} flex items-center gap-2 flex-nowrap`}
    >
      <div className="border-2  h-10 w-10 flex items-center justify-center rounded-full">
        {step}
      </div>
      <div>{title}</div>
    </div>
  );
}
