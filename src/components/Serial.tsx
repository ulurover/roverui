import { useState } from "react";
import { useSerial } from "../contexts/Serial.context";
import { Button, Grid, Group, Paper, Stack } from "@mantine/core";
import PortCard from "./PortCard";

export default function Serial() {
  const {
    canUseSerial,
    portState,
    ports,
    requestPort,
    connect,
    disconnect,
    readStart,
    readStop,
  } = useSerial();

  const [message, setMessage] = useState({
    value: "",
    timestamp: 0,
  });

  const PortCards = ports.map((port, index) => {
    return <PortCard key={index} port={port} />;
  });

  return (
    <Stack>
      <h1>WebSerial API</h1>
      <Paper shadow="sm" p="md" withBorder>
        <Grid>
          <Grid.Col span={6}>
            <h2>Device Info</h2>
            <p>{canUseSerial ? "Can use serial" : "Cannot use serial"}</p>
            <p>Port state: {portState}</p>
            <Stack align="stretch">
              <Button onClick={requestPort}>Request Access</Button>
              <Button
                onClick={() => {
                  console.log(ports);
                }}
              >
                Console.log(ports)
              </Button>
              <Button onClick={disconnect}>Disconnect</Button>
              <Group grow>
                <Button color="green" onClick={readStart}>
                  readStart
                </Button>
                <Button color="red" onClick={readStop}>
                  readStop
                </Button>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <h2>Device List</h2>
            {PortCards}
          </Grid.Col>
        </Grid>
      </Paper>
      <Paper shadow="sm" p="md" withBorder>
        <h1>Serial Data</h1>
        <p>{message.value}</p>
        <p>{message.timestamp}</p>
      </Paper>
    </Stack>
  );
}
