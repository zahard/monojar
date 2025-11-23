import { formatCurrency, formatCurrencyCents } from "../hooks/format-num";
import type { JarInfo } from "../types/jar-info";

export function JarView({ jar }: { jar: JarInfo }) {
  const percent = jar.goal ? Math.min(100, (jar.balance * 100) / jar.goal) : 0;
  const percentRounded = Math.round(percent * 100) / 100;
  return (
    <div className="w-full">
      <div className="text-xl lg:text-3xl mb-2">{jar.title}</div>
      {jar.description?.length > 0 && (
        <div className="lg:text-md text-sm">{jar.description}</div>
      )}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <div className="text-2xl lg:text-3xl font-semibold text-nowrap">
          {formatCurrency(jar.balance)}
          <span className="text-sm">{formatCurrencyCents(jar.balance)} ₴</span>
        </div>
        {jar.goal && (
          <span className="text-2xl lg:text-3xl text-neutral-400 text-nowrap">
            {"/" + formatCurrency(jar.goal)}
            <span className="text-sm">{formatCurrencyCents(jar.goal)} ₴</span>
          </span>
        )}
      </div>
      {jar.goal && (
        <div className="w-full h-5 bg-neutral-400 relative overflow-hidden rounded-md mt-2">
          <div
            className="bg-green-400 h-5"
            style={{ width: percentRounded + "%" }}
          ></div>
          <div className="text-sm font-bold absolute top-0 left-1/2 translate-x-[-50%]">
            {percentRounded}%
          </div>
        </div>
      )}
    </div>
  );
}
