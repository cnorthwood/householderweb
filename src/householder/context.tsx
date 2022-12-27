import React, { createContext, PropsWithChildren, useEffect, useState } from "react";

import Loader from "../ui/Loader";

export const WorkerContext = createContext<Worker | null>(null);

export default function WorkerProvider({ children }: PropsWithChildren) {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    setWorker(worker);
    return () => {
      worker.terminate();
    };
  }, []);

  if (!worker) {
    return <Loader />;
  }

  return <WorkerContext.Provider value={worker}>{children}</WorkerContext.Provider>;
}
