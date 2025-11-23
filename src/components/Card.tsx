export function Card({
  title,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto bg-slate-700 rounded-lg p-8 mb-5">
      <label
        className="font-medium block mb-2 text-lg
"
      >
        {title}
      </label>
      {children}
    </div>
  );
}
