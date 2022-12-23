import { useEffect, useState } from "react";

import { Grid, TextInput, Button } from "@mantine/core";
import { useInputState } from "@mantine/hooks";

import { useSerial } from "../contexts/Serial.context";

export default function Send(props: {}) {
  const { handleSend, connected } = useSerial();
  const [inputValue, setInputValue] = useInputState("");

  const handleSubmit = () => {
    if (inputValue) {
      handleSend(inputValue);
      setInputValue("");
    }
  };

  return (
    <Grid>
      <Grid.Col span={10}>
        <TextInput
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          disabled={!connected}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <Button
          onClick={handleSubmit}
          sx={{ width: "100%" }}
          disabled={!connected}
        >
          {">"}
        </Button>
      </Grid.Col>
    </Grid>
  );
}
