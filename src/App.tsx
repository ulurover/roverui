import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Header from "./components/Header";

import { useSerial } from "./contexts/SerialKangedcontext";
import { Container, Grid, Group, Paper, Stack } from "@mantine/core";
import { useUsb } from "./contexts/Usb.context";
import Serial from "./components/Serial";
import Webusb from "./components/Webusb";

function App() {
  const [communicationMode, setCommunicationMode] = useState<
    "serial" | "webusb"
  >("serial");

  return (
    <div className="App">
      <Header
        mode={{ communicationMode, setCommunicationMode }}
        links={[
          { link: "one", label: "one" },
          { link: "two", label: "two" },
        ]}
      />

      <div style={{ width: "100%" }}>
        {communicationMode === "webusb" ? <Webusb /> : <Serial />}
      </div>
      {/* <Grid>
        <Grid.Col span={6}>
          <Serial />
        </Grid.Col>
        <Grid.Col span={6}>
          <Webusb />
        </Grid.Col>
      </Grid> */}
    </div>
  );
}

export default App;
