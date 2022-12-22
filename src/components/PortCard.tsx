import React, { useEffect } from "react";

import { Button, Card, Group, Stack, Text } from "@mantine/core";
import { useSerial } from "../contexts/Serial.context";

export default function PortCard(props: { port: SerialPort }) {
  const SerialPort = props.port;
  const { connect, portState } = useSerial();
  const [info, setInfo] = React.useState<Partial<SerialPortInfo> | null>(null);

  //const { selectedDevice, selectDevice } = useSerial();

  const handleConnect = async () => {
    connect(SerialPort);
  };

  const handleGetInfo = async () => {
    const info = SerialPort.getInfo();
    console.log(info);
    setInfo(info);
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  return (
    <Card
      withBorder
      radius="md"
      p="xl"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      })}
    >
      <Group position="apart">
        <Stack spacing="xs">
          <Text size="xs" transform="uppercase" weight={700} color="dimmed">
            VID: {info?.usbVendorId}
          </Text>
          <Text size="lg" weight={500}>
            PID: {info?.usbProductId}
          </Text>
        </Stack>
        <Group>
          <Button onClick={handleConnect} disabled={!(portState === "closed")}>
            connect
          </Button>

          <Button onClick={handleGetInfo}>getInfo</Button>
        </Group>
      </Group>
    </Card>
  );
}
