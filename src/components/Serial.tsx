import { useState } from "react";
import { useSerial } from "../contexts/Serial.context";
import { Button, Grid, Group, Paper, Stack, Title, Text } from "@mantine/core";
import Shell from "./Shell";
import Send from "./Send";

export default function Serial() {
  const { connected, connect, received, handleSend, close } = useSerial();

  return (
    <Stack>
      <Title order={2}>WebSerial API</Title>
      <Grid sx={{ margin: "0" }}>
        <Grid.Col span={6}>
          <Stack>
            <Paper shadow="sm" p="md" withBorder>
              <Title order={2}>Device Info</Title>
              <Text>
                Device {true ? "supporting" : "not-supporting"} Web Serial
              </Text>
              <Text>
                Port state: {connected ? "connected" : "not connected"}
              </Text>
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
            <Paper shadow="sm" p="md" withBorder>
              <Title order={2}>Send payload</Title>
              <Send />
            </Paper>
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Paper shadow="sm" p="md" withBorder>
            <Title order={2}>Serial Data</Title>
            <Shell received={received} />
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
