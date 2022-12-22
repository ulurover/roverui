export default class Serial {
  onSuccess = () => {};
  onFail = () => {};
  onReceive = (value: string) => {};
  open: boolean;
  textDecoder: TextDecoderStream | undefined;
  readableStreamClosed: Promise<void> | undefined;
  reader: ReadableStreamDefaultReader<string> | undefined;
  port: SerialPort | undefined;
  outputStream: WritableStream | undefined;
  inputStream: ReadableStream | undefined;
  baudRate: number;

  constructor() {
    this.open = false;

    this.textDecoder = undefined;
    this.readableStreamClosed = undefined;
    this.reader = undefined;

    this.port = undefined;

    this.outputStream = undefined;
    this.inputStream = undefined;

    this.baudRate = 115200;
  }

  supported() {
    return "serial" in navigator;
  }

  async requestPort() {
    await this.close();

    /*
        navigator.serial.addEventListener('connect', (e) => {
            this.port = e.port || e.target
            this.openPort()
        })

        navigator.serial.addEventListener('disconnect', () => {
            console.warn(`[SERIAL] Disconnected!`)
            this.onFail()
        })
        */

    // Filter on devices with the Arduino Uno USB Vendor/Product IDs
    const filters: SerialPortFilter[] = [
      { usbVendorId: 0x0483, usbProductId: 0x5740 },
    ];

    // Prompt user to select a serial port
    try {
      this.port = await navigator.serial.requestPort({ filters });
      //await port.open({ baudRate: 115200 })
    } catch (e) {
      console.error(e);
      return `${e}`;
    }

    return this.openPort();
  }

  async openPort() {
    if (!this.port) {
      console.error(`[SERIAL] No port selected!`);
      this.onFail();
      return "No port selected!";
    }

    try {
      await this.port.open({ baudRate: this.baudRate });
    } catch (e) {
      console.error(e);
      this.onFail();
      return `${e}`;
    }

    console.log(`[SERIAL] Connected`);

    this.port.addEventListener("disconnect", () => {
      console.warn(`[SERIAL] Disconnected!`);
      this.onFail();
    });

    this.outputStream = this.port.writable;
    this.inputStream = this.port.readable;

    this.onSuccess();
    this.open = true;

    this.read();

    return "";
  }

  async read() {
    if (!this.port) {
      console.error(`[SERIAL] No port selected!`);
      this.onFail();
      return;
    }

    while (this.port.readable && this.open) {
      this.textDecoder = new window.TextDecoderStream();
      this.readableStreamClosed = this.port.readable.pipeTo(
        this.textDecoder.writable
      );
      this.reader = this.textDecoder.readable.getReader();

      try {
        while (true && this.open) {
          const { value, done } = await this.reader.read();
          console.log(value);
          if (done) {
            // |reader| has been canceled.
            break;
          }
          if (value) this.onReceive(value);
        }
      } catch (error) {
        // Handle |error|...
        //console.error(error)
        this.onFail();
      } finally {
        await this.close();
      }
    }
  }

  async send(value: string) {
    console.log(`Send: ${value}`);
    if (!this.outputStream) {
      console.error(`[SERIAL] No output stream!`);
      return;
    }

    const encoder = new TextEncoder();
    const writer = this.outputStream.getWriter();

    writer.write(encoder.encode(value));
    writer.releaseLock();
    /*sendMessage(value, this.outputStream)

        const textEncoder = new window.TextEncoderStream()
        textEncoder.readable.pipeTo(this.outputStream)
        const writer = textEncoder.writable.getWriter()

        await writer.write(value)
        writer.releaseLock()*/
  }

  async sendByte(value: number) {
    if (!this.outputStream) {
      console.error(`[SERIAL] No output stream!`);
      return;
    }

    const writer = this.outputStream.getWriter();

    const data = new Uint8Array([value]);
    await writer.write(data);

    writer.releaseLock();
  }

  async close() {
    if (this.open && this.reader && this.readableStreamClosed && this.port) {
      this.open = false;

      await this.reader.cancel().catch(() => {
        /* Ignore the error */
      });
      await this.readableStreamClosed.catch(() => {
        /* Ignore the error */
      });

      await this.port.close();

      console.log("[SERIAL] Closed");
    }
  }

  setBaudRate(newBaudRate: number) {
    this.baudRate = newBaudRate;
  }
}
