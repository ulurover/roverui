import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type PortState = "closed" | "closing" | "open" | "opening";

export interface SerialContextValue {
  canUseSerial: boolean;
  portState: PortState;
  ports: SerialPort[];
  requestPort(): Promise<SerialPort | null>;
  connect(port: SerialPort): Promise<boolean>;
  disconnect(): void;
  readStart(): Promise<void>;
  readStop(): Promise<void>;
}

export const SerialContext = createContext<SerialContextValue>({
  canUseSerial: false,
  portState: "closed",
  ports: [],
  requestPort: () => Promise.resolve(null),
  connect: () => Promise.resolve(false),
  disconnect: () => {},
  readStart: () => Promise.resolve(),
  readStop: () => Promise.resolve(),
});

export const useSerial = () => useContext(SerialContext);

export default function SerialProvider(props: { children: React.ReactNode }) {
  const [canUseSerial] = useState(() => "serial" in navigator);
  const [portState, setPortState] = useState<PortState>("closed");

  const [ports, setPorts] = useState<SerialPort[]>([]);

  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  const requestPort = async () => {
    console.log("Requesting port...");
    try {
      const port = await navigator.serial.requestPort({
        filters: [
          // { vendorId: 0x0483, productId: 0x5740 }
        ],
      });
      console.log("Port opened", port);
      return port;
    } catch (error) {
      console.error("Error requesting port", error);
      return null;
    }
  };

  const getPorts = async () => {
    try {
      const ports = await navigator.serial.getPorts();
      console.log("Ports", ports);
      setPorts(ports);
    } catch (error) {
      console.error("Error getting ports", error);
    }
  };

  const connect = async (port: SerialPort) => {
    console.log("Connecting to port", port);
    try {
      await port.open({
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "hardware",
      });
      console.log("Port opened", port);
      setPortState("open");
      portRef.current = port;
      return true;
    } catch (error) {
      console.error("Error opening port", error);
      return false;
    }
  };

  const disconnect = async () => {
    console.log("Disconnecting from port", portRef.current);
    try {
      await portRef.current?.close();
      console.log("Port closed", portRef.current);
      setPortState("closed");
      portRef.current = null;
    } catch (error) {
      console.error("Error closing port", error);
    }
  };

  useEffect(() => {
    getPorts();

    navigator.serial.addEventListener("connect", (event) => {
      console.log("Port connected", event);
      getPorts();
    });
    navigator.serial.addEventListener("disconnect", (event) => {
      console.log("Port disconnected", event);
      getPorts();
    });
  }, []);

  const readStart = async () => {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = portRef.current?.readable.pipeTo(
      textDecoder.writable
    );
    const reader = portRef.current?.readable.getReader();

    try {
      if (!reader) {
        throw new Error("No reader");
      }

      readerRef.current = reader;
      while (portRef.current?.readable) {
        const { value, done } = await reader.read();

        if (done) {
          console.log("Done reading");
          break;
        }
        if (value) {
          const timestamp = Date.now();

          const data = new TextDecoder().decode(value);
          //console.log("Read value", data);
          console.log("Read value", value);
        }
      }
    } catch (error) {
      console.error("Error reading port", error);
    } finally {
      readerRef.current?.releaseLock();
      readerRef.current = null;
    }

    await readableStreamClosed?.catch((error) => {
      console.error("Error reading stream", error);
    });
  };

  const readStop = async () => {
    readerRef.current?.cancel();
    readerRef.current = null;
  };

  return (
    <>
      <SerialContext.Provider
        value={{
          canUseSerial,
          portState,
          ports,
          requestPort,
          connect,
          disconnect,
          readStart,
          readStop,
        }}
      >
        {props.children}
      </SerialContext.Provider>
    </>
  );
}
