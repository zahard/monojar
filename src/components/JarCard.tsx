import type { JarInfo } from "../types/jar-info";
import { Button } from "./Button";
import { JarView } from "./JarView";

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
  return (
    <div
      className={`cursor-pointer w-full hover:bg-slate-600 rounded-lg p-5 lg:p-8 mb-5 ${
        selected ? "bg-slate-600" : "bg-slate-700"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 w-full">
        {/* <div>
          <div className="w-5 h-5 flex items-center justify-center bg-neutral-900 rounded-full">
            {selected && (
              <div className="w-3.5 h-3.5 bg-orange-400 rounded-full"></div>
            )}
          </div>
        </div> */}
        <JarView jar={jar} />
      </div>
      {selected && (
        <div>
          <div className="flex justify-center mt-6 gap-2">
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
