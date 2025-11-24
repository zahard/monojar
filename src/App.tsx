import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import "./App.css";
import { Button } from "./components/Button";
import { getJars } from "./hooks/getJars";
import type { JarInfo } from "./types/jar-info";
import { Spinner } from "./components/Spinner";
import { Card } from "./components/Card";
import { JarCard } from "./components/JarCard";
import { Step } from "./components/Step";
import { GenerateStatement } from "./components/GenerateStatement";
import { apiSettings } from "./hooks/api.settings";
import { resData } from "./hooks/data";
import { TablePreview } from "./components/TablePreview";
import exportFromJSON from "export-from-json";

function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [apiIsReady, setApiIsReady] = useState(false);
  const [secondsToRequest, setSecondsToRequest] = useState(0);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [monobankToken, setMonobankToken] = useState("");
  const [jarsList, setJarsList] = useState<JarInfo[]>([]);
  const [jarsLoading, setJarsLoading] = useState(false);
  const [selectedJarId, setSelectedJarId] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || "";
    setMonobankToken(value.trim());
  };

  // Handle
  useEffect(() => {
    if (lastRequestTime === 0) {
      return;
    }
    const timer = setInterval(() => {
      const awaitTimeSeconds = apiSettings.waitingTime;
      const secondsDiff = Math.floor((Date.now() - lastRequestTime) / 1000);
      if (secondsDiff < awaitTimeSeconds) {
        setSecondsToRequest(awaitTimeSeconds - secondsDiff);
      } else {
        clearInterval(timer);
        setApiIsReady(true);
        setSecondsToRequest(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastRequestTime]);

  const resetApiCountdown = () => {
    setLastRequestTime(Date.now());
    setApiIsReady(false);
  };

  const onGetJarsHandle = async () => {
    setJarsLoading(true);
    try {
      const data = await getJars();
      setLastRequestTime(Date.now());
      setJarsList(data);
      setJarsLoading(false);
      setActiveStep(2);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const onJarConfirmedHandle = () => {
    setActiveStep(3);
  };

  const onExportHandle = (target: string) => {
    const fileName = "statement";
    const exportType =
      target === "json" ? exportFromJSON.types.json : exportFromJSON.types.xls;

    exportFromJSON({ data: resData, fileName, exportType });
  };

  const selectedJar = useMemo(() => {
    return jarsList.find((jar) => jar.id === selectedJarId);
  }, [jarsList, selectedJarId]);

  const steps = ["Provide Token", "Select Jar", "Generate Statement", "Export"];

  return (
    <>
      <header className="w-full sticky top-0 bg-slate-700 z-20">
        <div className="py-3 px-10 max-w-3xl mx-auto">
          <div className="text-center">{"🐱 Monobank Statement Exporter"}</div>
        </div>
        <div className="w-full h-14 bg-gray-800 py-2">
          <div className="max-w-4xl mx-auto relative justify-around flex gap-10">
            {steps.map((stepName, index) => (
              <Step
                key={stepName}
                step={index + 1 + ""}
                title={stepName}
                active={activeStep === index + 1}
                completed={activeStep > index + 1}
              />
            ))}
          </div>
        </div>
      </header>
      <main className="px-5 lg:px-10 pt-3 lg:pt-10 max-w-3xl mx-auto ">
        {activeStep === 1 && (
          <>
            <Card title="Provide Token">
              <p className="max-w-xl mb-1">
                In order to get statement from your jar - list of all jars
                should be fetched first to find corrent <i>accountId</i>. For
                this you need to provide <strong>Monobank API Token</strong>.
                Information about how to get it is here{" "}
                <a
                  className="text-orange-500 underline"
                  href=" https://api.monobank.ua/"
                  target="__blank"
                >
                  {"https://api.monobank.ua/"}
                </a>
                .
              </p>
            </Card>

            <Card title="Monobank Token">
              <p className="text-neutral-400 text-sm max-w-xl mb-3">
                *Disclosure: for your security token will not be saved anywhere,
                including browser cookies, localStorage, etc. So after page
                reloading you will have to provide it again
              </p>
              <input
                placeholder="Monobank Token"
                type="text"
                className="rounded-xxl h-10 w-full bg-gray-800 text-neutral-100 disabled:text-neutral-500 border-neutral-50  px-5 rounded-full"
                value={monobankToken}
                onChange={handleChange}
                disabled={jarsLoading}
                style={{ fontSize: "16px" }}
              />
              <div className="flex justify-center mt-4 gap-2">
                <Button
                  color="orange"
                  disabled={!monobankToken || jarsLoading}
                  onClick={onGetJarsHandle}
                >
                  Get Jars List
                </Button>
                {jarsLoading && <Spinner />}
              </div>
            </Card>
          </>
        )}
        {activeStep === 2 && (
          <>
            <Card title="Find your Jar">
              <p className="max-w-xl mb-1">
                Find and select the jar that you what to use for statement
                export below. Click 'Load Jar Statement' to proceed. <br />
                Note that it will fetch only transaction up to 31 days old.
              </p>
            </Card>

            {jarsList.map((jar) => (
              <JarCard
                key={jar.id}
                selected={selectedJarId === jar.id}
                jar={jar}
                onClick={() => setSelectedJarId(jar.id)}
                onJarConfirmed={onJarConfirmedHandle}
              />
            ))}
          </>
        )}
        {activeStep === 3 && selectedJar && (
          <GenerateStatement
            apiIsReady={apiIsReady}
            apiToken={monobankToken}
            secondsToRequest={secondsToRequest}
            jar={selectedJar}
            onBack={() => setActiveStep((s) => (s > 1 ? s - 1 : s))}
            onReady={() => setActiveStep(4)}
            onCancel={() => {}}
            onFetch={() => resetApiCountdown()}
          />
        )}

        {activeStep === 4 && (
          <>
            <Card title="Export Options">
              <p className="mb-4">
                There are {resData.length} transactions found. This data can be
                exported to JSON file or Excel/GoogleTable format file.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button color="green" onClick={() => onExportHandle("json")}>
                  Download JSON
                </Button>
                <Button color="green" onClick={() => onExportHandle("xls")}>
                  Download XLSX
                </Button>
              </div>
            </Card>
            <Card title="Transactions">
              <TablePreview data={resData} />
            </Card>
            <div className="flex justify-center p-5 pt-0">
              <Button color="white" onClick={() => setActiveStep(2)}>
                Choose Another Jar
              </Button>
            </div>
          </>
        )}
      </main>
      <footer className="h-20 flex flex-col justify-end p-3 mt-auto">
        <div className="text-center text-neutral-200 text-sm">
          Kharkiv, 2025 by{" "}
          <a
            className="text-orange-500"
            href="https://github.com/zahard/monojar/"
          >
            zahard
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
