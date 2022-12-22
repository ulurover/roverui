import React from "react";

import { Button, Card, Group, Stack, Text } from "@mantine/core";
import { useUsb } from "../contexts/Usb.context";

export default function DeviceCard(props: { USBDevice: USBDevice }) {
  const { manufacturerName, productName } = props.USBDevice;

  const { selectedDevice, selectDevice } = useUsb();

  const selectHandler = () => {
    selectDevice(props.USBDevice);
  };

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
      <Group>
        <Stack spacing="xs">
          <Text size="xs" transform="uppercase" weight={700} color="dimmed">
            {manufacturerName}
          </Text>
          <Text size="lg" weight={500}>
            {productName}
          </Text>
        </Stack>
        <Button
          onClick={selectHandler}
          disabled={selectedDevice === props.USBDevice}
        >
          Select
        </Button>
      </Group>
    </Card>
  );
}
