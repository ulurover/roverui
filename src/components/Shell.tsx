import { Code } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { useSerial } from "../contexts/Serial.context";

export default function Shell(props: {
  received: {
    timestamp: Date;
    value: string;
  };
}) {
  const { history } = useSerial();

  const data = history.map((line) => line.value).join("\n");

  return <Code block>{data}</Code>;
}
