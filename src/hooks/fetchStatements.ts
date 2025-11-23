import { apiSettings } from "./api.settings";
import { fetch2 } from "./fetch2";

export async function fetchStatements({
  apiToken,
  jarId,
  log,
  resetApiCountdown,
}: {
  jarId: string;
  apiToken: string;
  log: (s: string) => void;
  resetApiCountdown: () => void;
}) {
  const maxAllowedTimeDiff = 31 * 24 * 3600 + 3600; // 31 days + 1 hour
  const unixTimeNow = Math.floor(new Date().getTime() / 1000);
  const startFrom = unixTimeNow - maxAllowedTimeDiff;

  const totalData = [];

  function fetchList(timeTo: number | null) {
    const toStr = timeTo ? "/" + timeTo : "";
    return fetch2(
      `https://api.monobank.ua/personal/statement/${jarId}/${startFrom}` +
        toStr,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Token": apiToken,
        },
      }
    ).then((res) => {
      resetApiCountdown();
      return res.json();
    });
  }

  function waitBetweenRequests() {
    log("Waiting before next request...");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, apiSettings.waitingTime * 1000);
    });
  }

  log("Starting...");

  let to = null;
  while (true) {
    const data = await fetchList(to);
    log(`Received ${data.length} lines.`);
    totalData.push(...data);
    if (data.length < apiSettings.batchSize) {
      break;
    } else {
      to = data[data.length - 1].time;
      await waitBetweenRequests();
    }
  }

  log("Total transactions: " + totalData.length);
  log("Completed!");

  return totalData;
}
