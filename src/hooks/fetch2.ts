import type { JarTransaction } from "../types/transaction";
import { apiSettings } from "./api.settings";
import { resData } from "./data";

let counter = -1;
export function fetch2(
  url = "",
  options = {}
): Promise<{ json: () => Promise<JarTransaction[]> }> {
  console.log("Fake fetch", url, options);
  counter++;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        json: () =>
          Promise.resolve(
            resData.slice(
              counter * apiSettings.batchSize,
              counter * apiSettings.batchSize + apiSettings.batchSize
            )
          ),
      });
    }, 300);
  });
}
