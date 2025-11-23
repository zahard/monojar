import { useState } from "react";
import type { JarInfo } from "../types/jar-info";
import { Button } from "./Button";
import { Card } from "./Card";
import { JarView } from "./JarView";
import { fetchStatements } from "../hooks/fetchStatements";
import type { JarTransaction } from "../types/transaction";
import { ProgressLog } from "./Log";

export function GenerateStatement({
  jar,
  apiIsReady,
  apiToken,
  secondsToRequest,
  onReady,
  onBack,
  onFetch,
}: {
  jar: JarInfo;
  apiToken: string;
  apiIsReady: boolean;
  secondsToRequest: number;
  onReady: (t: JarTransaction[]) => void;
  onCancel: () => void;
  onBack: () => void;
  onFetch: () => void;
}) {
  const [transactions, setTransactions] = useState<JarTransaction[]>([]);
  const [status, setStatus] = useState<"pending" | "started" | "ready">(
    "pending"
  );
  const [logs, setLogs] = useState<string[]>([]);

  const generateStatementHandle = async () => {
    setStatus("started");
    try {
      const result = await fetchStatements({
        jarId: jar.id,
        apiToken: apiToken,
        log: (text) => {
          setLogs((prev) => [...prev, text]);
        },
        resetApiCountdown: () => {
          onFetch();
        },
      });
      setTransactions(result);
      setStatus("ready");
    } catch (e) {
      console.error(e);
      setStatus("pending");
      setLogs([]);
    }
  };

  const goToExportHandle = () => {
    onReady(transactions);
  };

  const cancelHandler = () => {
    console.log("Cancel next request");
    setStatus("pending");
  };

  const backButtonHandle = () => {
    if (status === "started") {
      cancelHandler();
    }
    onBack();
  };
  return (
    <>
      <div className="flex justify-end p-3 max-w-2xl mx-auto">
        <span
          className="text-neutral-300 underline cursor-pointer"
          onClick={backButtonHandle}
        >
          ← Return to jar selection step
        </span>
      </div>
      <Card title="Selected Jar:">
        <JarView jar={jar} />
      </Card>
      <Card>
        {status === "pending" && (
          <>
            <p className="text-neutral-100 text-sm max-w-xl mt-4">
              This might take some time due to MonoAPI limitations. We are
              allowed to make 1 request per minute, and each request can return
              up to 500 transations. (+1 min for each 500 transactions). And no
              transaction older than 31 days would not be included.
            </p>
            <div className="flex justify-center mt-4 gap-2">
              <Button
                color="orange"
                onClick={generateStatementHandle}
                disabled={!apiIsReady}
              >
                Generate Statement
              </Button>
            </div>
            {!apiIsReady && (
              <p className="text-neutral-300 text-sm max-w-xl mt-4 text-center">
                Waiting until 1 minute after previous request.{" "}
                {secondsToRequest} seconds left.
              </p>
            )}
          </>
        )}

        {(status === "started" || status === "ready") && (
          <ProgressLog
            logs={logs}
            waitTime={secondsToRequest}
            showLoading={status === "started"}
          />
        )}
        <div className="flex justify-center mt-4 gap-2">
          {status === "ready" && (
            <Button color="orange" onClick={goToExportHandle}>
              Choose Export Options
            </Button>
          )}
          {status === "started" && (
            <Button color="white" onClick={cancelHandler}>
              Cancel
            </Button>
          )}
        </div>
      </Card>
    </>
  );
}
