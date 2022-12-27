import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import WorkerProvider from "./householder/context";
import "./main.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WorkerProvider>
      <App />
    </WorkerProvider>
  </React.StrictMode>,
);
