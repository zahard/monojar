export function Button({
  disabled = false,
  color = "green",
  children,
  onClick = () => {},
}: {
  disabled?: boolean;
  color?: "green" | "orange" | "white";
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const colorMap = {
    green: "bg-green-600",
    orange: "bg-orange-500",
    white: "bg-gray-100",
  };
  const textMap = {
    green: "text-neutral-50",
    orange: "text-neutral-50",
    white: "text-gray-900",
  };
  const bgClass = colorMap[color];
  const textClass = textMap[color];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${bgClass} ${textClass} text-nowrap cursor-pointer disabled:cursor-default inline-flex h-10 px-5 items-center justify-center rounded-full font-medium transition active:scale-95 disabled:bg-gray-400 disabled:active:scale-100`}
    >
      {children}
    </button>
  );
}
