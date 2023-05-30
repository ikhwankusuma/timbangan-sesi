import { SerialPort } from "serialport"
import { PortInfo } from "@serialport/bindings-cpp"

async function validatePort(port: SerialPort): Promise<boolean> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(false)
    }, 1000)
    let str: string = ""
    port.open((e: Error) => {
      if (e) resolve(false)
    })
    port.on("data", (data: Buffer) => {
      try {
        str += data.toString()
        if (/((\+|\-)\d+\.\d*)|(\+|\-) *\d+/g.test(str)) {
          clearTimeout(timeout)
          if (port.isOpen) port.close()
          setTimeout(() => {
            resolve(true)
          }, 100)
        }
      } catch (e) {
        resolve(e)
      }
    })
  })
}

export async function detectPort(): Promise<{
  _id: string
  path: string
}> {
  return new Promise(async (resolve, reject) => {
    const ports: PortInfo[] = await SerialPort.list()
    for (let i: number = 0; i < ports.length; i++) {
      if (ports[i]) {
        const { serialNumber, path }: PortInfo = ports[i]
        const port: SerialPort = new SerialPort({
          path,
          autoOpen: false,
          baudRate: 2400,
          dataBits: 7,
          parity: "none",
          stopBits: 1,
          lock: false
        })
        if (await validatePort(port)) {
          i = ports.length + 1
          resolve({
            _id: serialNumber,
            path
          })
        }
        else if (i === ports.length - 1) {
          reject()
        }
      }
    }
  })
}