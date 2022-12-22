import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { MantineProvider } from "@mantine/core";
import SerialProvider from "./contexts/Serial.context";
import UsbProvider from "./contexts/Usb.context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    theme={{ colorScheme: "dark" }}
  >
    <UsbProvider>
      <SerialProvider>
        <App />
      </SerialProvider>
    </UsbProvider>
  </MantineProvider>
);
