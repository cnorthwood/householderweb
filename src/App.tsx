import React, { SetStateAction, useCallback, useContext, useEffect, useState } from "react";

import { WorkerContext } from "./householder/context";
import type { HouseholdingOptions } from "./householder/main";
import type { WorkerMessage, WorkerResponse } from "./householder/worker";
import DownloadScreen from "./ui/DownloadScreen";
import ErrorScreen from "./ui/ErrorScreen";
import LoadFileScreen from "./ui/LoadFileScreen";
import Loader from "./ui/Loader";
import OptionsScreen from "./ui/OptionsScreen";

const OPTIONS_LOCAL_STORAGE_KEY = "householder-options";

function loadOptionsFromLocalStorage(): HouseholdingOptions {
  const fromLocalStorage = window.localStorage.getItem(OPTIONS_LOCAL_STORAGE_KEY);
  if (fromLocalStorage) {
    try {
      return JSON.parse(fromLocalStorage);
    } catch (e) {
      return {};
    }
  }
  return {};
}

export default function App() {
  const worker = useContext(WorkerContext)!;
  const [error, setError] = useState<string | null>();
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputFile, setOutputFile] = useState<File | null>(null);
  const [fileLoadError, setFileLoadError] = useState<string | undefined>();
  const [numVoters, setNumVoters] = useState<number | null>(null);
  const [options, setOptions] = useState<HouseholdingOptions>(loadOptionsFromLocalStorage());
  const [householding, setHouseholding] = useState(false);

  const selectFile = useCallback(
    (selectedFile: File) => {
      setInputFile(selectedFile);
      setFileLoadError(undefined);
      worker.postMessage({ type: "LOAD_FILE", file: selectedFile } as WorkerMessage);
    },
    [worker],
  );

  const changeOptions = useCallback((setOptionsCallback: SetStateAction<HouseholdingOptions>) => {
    setOptions((options) => {
      const nextOptions = typeof setOptionsCallback === "function" ? setOptionsCallback(options) : setOptionsCallback;
      window.localStorage.setItem(OPTIONS_LOCAL_STORAGE_KEY, JSON.stringify(nextOptions));
      return nextOptions;
    });
  }, []);

  const household = useCallback(() => {
    setHouseholding(true);
    worker.postMessage({ type: "HOUSEHOLD", options } as WorkerMessage);
  }, [options, worker]);

  const reset = useCallback(() => {
    setOutputFile(null);
  }, []);

  const workerListener = useCallback((ev: MessageEvent) => {
    const data = ev.data as WorkerResponse;
    switch (data.type) {
      case "ERROR":
        setError(data.message);
        return;
      case "FILE_LOAD_ERROR":
        setInputFile(null);
        setFileLoadError(data.message);
        return;
      case "FILE_LOADED":
        setNumVoters(data.voters);
        return;
      case "HOUSEHOLD_COMPLETE":
        setHouseholding(false);
        setOutputFile(data.file);
        return;
      default:
        setError("Unrecognised worker response");
    }
  }, []);

  useEffect(() => {
    worker.addEventListener("message", workerListener);

    return () => worker.removeEventListener("message", workerListener);
  }, [worker, workerListener]);

  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (!inputFile) {
    return <LoadFileScreen onSelectFile={selectFile} error={fileLoadError} />;
  }

  if (outputFile) {
    return <DownloadScreen outputFile={outputFile} onCancel={reset} />;
  }

  if (numVoters && !householding) {
    return (
      <OptionsScreen numVoters={numVoters} options={options} onChangeOptions={changeOptions} onHousehold={household} />
    );
  }

  return <Loader />;
}
