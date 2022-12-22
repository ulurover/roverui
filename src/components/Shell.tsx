import { Code } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { useSerial } from "../contexts/Serial.context";

export default function Shell(props: {
  received: {
    timestamp: Date;
    value: string;
  };
}) {
  const [input, setInput] = useState("");

  const { history } = useSerial();

  // List of received lines
  const [localHistory, setLocalHistory] = useState<
    { value: string; timestamp: Date }[]
  >([]);

  const data = history.map((line) => line.value).join("\n");

  useEffect(() => {
    const str = `${props.received.value}`;
    const lines = str.split("\n");

    const newLines: { value: string; timestamp: Date }[] = [];

    // if (lines.length > 1 && lines) {
    //   lines.pop();
    //   lines.forEach((line) => {
    //     newLines.push({
    //       value: `${line}`,
    //       timestamp: props.received.timestamp,
    //     });
    //   });
    // }

    if (props.received.value) {
      newLines.push({
        value: props.received.value,
        timestamp: props.received.timestamp,
      });
    }

    setLocalHistory((current) => current.concat(newLines));
  }, [props.received]);

  return <Code block>{data}</Code>;
}
