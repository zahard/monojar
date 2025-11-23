export function Card({
  title,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="w-full bg-slate-700 rounded-lg p-5 lg:p-8 mb-5">
      {title && (
        <label className="font-medium block mb-2 text-lg">{title}</label>
      )}
      <div className="lg:text-md text-sm">{children}</div>
    </div>
  );
}
