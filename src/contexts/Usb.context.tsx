import { createContext, useContext, useEffect, useRef, useState } from "react";

export interface UsbContextValue {
  webUsbSupported: boolean;
  requestDevice(): Promise<USBDevice | null>;
  deviceList: USBDevice[];
  selectDevice(device: USBDevice): void;
  selectedDevice: USBDevice | null;
}

export const UsbContext = createContext<UsbContextValue>({
  webUsbSupported: false,
  requestDevice: () => Promise.resolve(null),
  deviceList: [] as USBDevice[],
  selectDevice: () => {},
  selectedDevice: null,
});

export const useUsb = () => useContext(UsbContext);

export default function UsbProvider(props: { children: React.ReactNode }) {
  const [deviceList, setDeviceList] = useState<USBDevice[]>([]);
  const [webUsbSupported, setWebUsbSupported] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<USBDevice | null>(null);

  useEffect(() => {
    if (navigator.usb) {
      console.log("WebUSB supported");
      setWebUsbSupported(true);
    } else {
      console.log("WebUSB not supported");
    }
  }, []);

  const selectDevice = async (device: USBDevice) => {
    try {
      await device.open();
      await device.claimInterface(0);
      setSelectedDevice(device);
    } catch (error) {
      console.error(error);
    }
  };

  const requestDevice = async () => {
    console.log("requesting device");
    try {
      const device = await navigator.usb.requestDevice({
        filters: [
          // { vendorId: 0x0483, productId: 0x5740 }
        ],
      });
      console.log(device);
      getDevices();
      return device;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getDevices = async () => {
    console.log("getting devices");
    const devs = await navigator.usb.getDevices();
    console.log(devs);
    setDeviceList(devs);
  };

  useEffect(() => {
    getDevices();

    navigator.usb.addEventListener("disconnect", (event) => {
      console.log(event);
      getDevices();
    });
    navigator.usb.addEventListener("connect", (event) => {
      console.log(event);
      getDevices();
    });
    navigator.usb.addEventListener("controltransfersuccess", (event) => {
      console.log(event);
    });

    navigator.usb.addEventListener("controltransferfailure", (event) => {
      console.log(event);
    });
  }, []);

  return (
    <>
      <UsbContext.Provider
        value={{
          webUsbSupported,
          requestDevice,
          deviceList,
          selectDevice,
          selectedDevice,
        }}
      >
        {props.children}
      </UsbContext.Provider>
    </>
  );
}
