import { Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useUsb } from "../contexts/Usb.context";
import DeviceCard from "./DeviceCard";

export default function Webusb() {
  const { webUsbSupported, requestDevice, deviceList } = useUsb();

  const listDevices = () => {
    console.log(deviceList);
  };

  useEffect(() => {
    console.log("devices changed");
    console.log(deviceList);
  }, [deviceList]);

  const DeviceCards = deviceList.map((device) => {
    return <DeviceCard key={device.serialNumber} USBDevice={device} />;
  });

  return (
    <Stack>
      <h1>WebUSB API</h1>
      <Paper shadow="sm" p="md" withBorder>
        <Stack>
          <Group grow>
            <Button onClick={requestDevice}>Request device access</Button>
            <Button onClick={listDevices}>List devices (to dev console)</Button>
            <Text ta="center">
              WebUSB API {webUsbSupported ? "supported" : "not supported"}
            </Text>
          </Group>
          <Flex>{DeviceCards}</Flex>
        </Stack>
      </Paper>
    </Stack>
  );
}
