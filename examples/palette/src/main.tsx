import "./globals.css";
import "@triozer/framer-toolbox/dist/index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { framer } from "framer-plugin";
import { FramerPluginProvider } from "@triozer/framer-toolbox";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

import.meta.hot?.dispose(() => {
  void framer.closePlugin();
});

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <FramerPluginProvider>
      <App />
    </FramerPluginProvider>
  </React.StrictMode>
);
