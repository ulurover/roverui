import { useState } from "react";
import { useSerial } from "../contexts/Serial.context";
import { Paper, Stack } from "@mantine/core";

export default function Serial() {
  const {
    canUseSerial,
    hasTriedAutoconnect,
    subscribe,
    portState,
    connect,
    disconnect,
  } = useSerial();

  const [message, setMessage] = useState({
    value: "",
    timestamp: 0,
  });

  subscribe((message) => {
    setMessage(message);
    console.log(message);
  });

  return (
    <Stack>
      <h1>WebSerial API</h1>
      <Paper shadow="sm" p="md" withBorder>
        <h2>Device Info</h2>
        <p>{canUseSerial ? "Can use serial" : "Cannot use serial"}</p>
        <p>
          {hasTriedAutoconnect
            ? "Has tried autoconnect"
            : "Has not tried autoconnect"}
        </p>
        <p>Port state: {portState}</p>
        <button onClick={connect}>Connect</button>
        <button onClick={disconnect}>Disconnect</button>
      </Paper>
      <Paper shadow="sm" p="md" withBorder>
        <h1>Serial Data</h1>
        <p>{message.value}</p>
        <p>{message.timestamp}</p>
      </Paper>
    </Stack>
  );
}
