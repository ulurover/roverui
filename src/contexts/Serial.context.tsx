import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Serial from "../utils/Serial";

export interface SerialContextValue {
  connected: boolean;
  connect(): void;
  received: {
    timestamp: Date;
    value: string;
  };
  handleSend: (value: string) => void;
  close: () => void;
  history: SerialRxSchema[];
}

export const SerialContext = createContext<SerialContextValue>({
  connected: false,
  connect: () => {},
  received: {
    timestamp: new Date(),
    value: "",
  },
  handleSend: (value: string) => {},
  close: () => {},
  history: [],
});

export const useSerial = () => useContext(SerialContext);

interface SerialRxSchema {
  timestamp: Date;
  value: string;
}

type LineEnding = "none" | "\\r\\n" | "\\r" | "\\n";

const loadSettings = () => {
  let settings = {
    baudRate: 115200,
    msgStart: "#",
    msgEnd: "@",
    lineEnding: "\\n" as LineEnding,
    echoFlag: true,
    timeFlag: false,
    ctrlFlag: true,
  };
  return settings;
};

export default function SerialProvider(props: { children: React.ReactNode }) {
  const [serial] = useState(new Serial());
  const [connected, setConnected] = useState(false);

  // History data
  const [history, setHistory] = useState<SerialRxSchema[]>([]);
  // Receive Buffer
  const [received, setReceived] = useState({
    timestamp: new Date(),
    value: "",
  });
  // Temp Buffer for reciving un-complete data
  const tempBuffer = useRef<string | null>(null);

  // Settings
  const [settings, setSettings] = useState(loadSettings());

  useEffect(() => {
    setHistory((current) => current.concat(received));
  }, [received]);

  const recieveHandler = (value: string) => {
    const { msgStart, msgEnd } = settings;

    if (value.slice(0, 1) !== msgStart || value.slice(-1) !== msgEnd) {
      console.log("Un-complete data");
      tempBuffer.current = value;
    } else {
      console.log("Complete data");
      setReceived({
        timestamp: new Date(),
        value: `${value}`,
      });
    }
  };

  const connect = () => {
    if (!serial.supported()) {
      console.error(`Serial not supported`);
      return;
    }

    serial.onSuccess = () => {
      setConnected(true);
      console.log("Connected");
    };

    serial.onFail = () => {
      setConnected(false);
      console.log("Failed to connect");
    };

    serial.onReceive = (value) => {
      recieveHandler(value);
      return;

      if (value.slice(-1) !== "@") {
        console.log("Un-complete data writted to temp buffer");
        tempBuffer.current = value;
      } else if (tempBuffer.current !== null && value.slice(-1) === "@") {
        console.log("Complete data but temp buffer not empty");
        setReceived({
          timestamp: new Date(),
          value: `${tempBuffer.current}${value}`,
        });
        tempBuffer.current = null;
      } else if (tempBuffer.current !== null && value.slice(-1) !== "@") {
        console.log(
          "Un-complete data&&tempBuffer contains data writted to tempbuffer"
        );
        tempBuffer.current = `${tempBuffer.current}${value}`;
      } else {
        console.log("tempBuffer", tempBuffer.current);
        console.log("Complete data");
        setReceived({
          timestamp: new Date(),
          value: `${value}`,
        });
      }
    };

    serial.requestPort().then((res) => {
      if (res !== "") {
        console.error(res);
      }
    });
  };

  const handleSend = (str: string) => {
    const map = {
      none: "",
      "\\r": "\r",
      "\\n": "\n",
      "\\r\\n": "\r\n",
    };

    serial.send(`${str}${map[settings.lineEnding]}`);
  };

  const close = () => {
    serial.close();
    setConnected(false);
  };

  return (
    <>
      <SerialContext.Provider
        value={{
          connected,
          connect,
          received,
          handleSend,
          close,
          history,
        }}
      >
        {props.children}
      </SerialContext.Provider>
    </>
  );
}
