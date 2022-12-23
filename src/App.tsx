import { useState } from "react";
import Header from "./components/Header";

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
    </div>
  );
}

export default App;
