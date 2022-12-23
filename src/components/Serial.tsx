import { useState } from "react";
import { useSerial } from "../contexts/Serial.context";
import { Button, Grid, Group, Paper, Stack } from "@mantine/core";
import PortCard from "./PortCard";
import Shell from "./Shell";

export default function Serial() {
  const { connected, connect, received, handleSend, close } = useSerial();

  return (
    <Stack>
      <h1>WebSerial API</h1>
      <Grid sx={{ margin: "0" }}>
        <Grid.Col span={6}>
          <Paper shadow="sm" p="xs" withBorder>
            <h2>Device Info</h2>
            <p>{true ? "Can use serial" : "Cannot use serial"}</p>
            <p>Port state: {connected ? "connected" : "not connected"}</p>
            <Stack align="stretch">
              <Group grow>
                <Button onClick={connect} color="green">
                  Connect port
                </Button>
                <Button onClick={close} color="red">
                  Close port
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
          <Paper shadow="sm" p="xs" withBorder>
            <h2>Serial Data</h2>
            <Shell received={received} />
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
