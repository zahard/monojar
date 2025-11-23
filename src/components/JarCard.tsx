import { formatCurrency, formatCurrencyCents } from "../hooks/format-num";
import type { JarInfo } from "../types/jar-info";
import { Button } from "./Button";

export function JarCard({
  jar,
  selected = false,
  onClick = () => {},
  onJarConfirmed = () => {},
}: {
  jar: JarInfo;
  selected?: boolean;
  onClick: () => void;
  onJarConfirmed: () => void;
}) {
  const percent = jar.goal ? Math.min(100, (jar.balance * 100) / jar.goal) : 0;
  const percentRounded = Math.round(percent * 100) / 100;
  return (
    <div
      className={`cursor-pointer max-w-2xl mx-auto hover:bg-slate-600 rounded-lg p-8 mb-5 ${
        selected ? "bg-slate-600" : "bg-slate-700"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 w-full">
        <div>
          <div className="w-5 h-5 flex items-center justify-center bg-neutral-900 rounded-full">
            {selected && (
              <div className="w-3.5 h-3.5 bg-orange-400 rounded-full"></div>
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="text-2xl mb-2">{jar.title}</div>
          {jar.description?.length > 0 && (
            <div className="text-md">{jar.description}</div>
          )}
          <div className="flex items-center gap-2 mt-4">
            <div className="text-3xl font-semibold">
              {formatCurrency(jar.balance)}
              <span className="text-sm">
                {formatCurrencyCents(jar.balance)} ₴
              </span>
            </div>
            {jar.goal && (
              <>
                <div className="text-2xl">/</div>
                <div className="text-2xl text-neutral-400">
                  {formatCurrency(jar.goal)}
                  <span className="text-sm">
                    {formatCurrencyCents(jar.goal)} ₴
                  </span>
                </div>
              </>
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
      </div>
      {selected && (
        <div>
          <div className="flex justify-center mt-4 gap-2">
            <Button color="orange" onClick={onJarConfirmed}>
              Select Jar and Continue
            </Button>
          </div>
          <p className="text-neutral-400 text-sm max-w-xl mt-4 hidden">
            * This might take some time due to MonoAPI limitations. We are
            allowed to make 1 request per minute, and each request can return up
            to 500 transations. (+1 min for each 500 transactions)
            <br />* Submit button might be disabled if 1 minute didnt pass after
            getting list of jars. In that case just wait a little until
            countdown finish
          </p>
        </div>
      )}
    </div>
  );
}
