import { SerialPort } from "serialport"
import { PortInfo } from "@serialport/bindings-cpp"

let port: SerialPort = null
let path: string = ''
let count: number = 0

export function refreshPort(): Promise<boolean> {
  return new Promise((resolve) => {
    port.on('close', () => {
      port.open((e) => {
        if (e) resolve(false)
        else setTimeout(() => {
          resolve(true)
        }, 1000);
      })
    })
    port.drain(() => {
      port.close()
    })
  })
}

function writeSignal(payload: 'on' | 'off'): Promise<boolean> {
  return new Promise((resolve) => {
    port.write(payload, 'utf8', async (e) => {
      count++
      if (e || count >= 5) {
        setTimeout(async () => {
          count = 0
          await refreshPort()
          resolve(true)
        }, 500);
      } else resolve(true)
    })
  })
}

async function validatePort(port: SerialPort): Promise<boolean> {
  return new Promise((resolve) => {
    let timeout: NodeJS.Timeout = null
    let error: boolean = false
    port.on('close', () => {
      resolve(!error)
    })
    if (port.isOpen) {
      port.close()
    } else {
      port.open((e: Error) => {
        if (e) resolve(false)
        timeout = setTimeout(() => {
          error = true
          port.drain(() => {
            port.close()
          })
        }, 2000)
        port.on("data", (data: Buffer) => {
          try {
            let str: string = ""
            str += data.toString()
            if (str.includes('p')) {
              clearTimeout(timeout)
              if (port.isOpen) {
                port.drain(() => {
                  port.close()
                })
              } else {
                resolve(true)
              }
            }
          } catch (e) {
            if (port.isOpen) {
              error = true
              port.drain(() => {
                port.close()
              })
            } else {
              resolve(false)
            }
          }
        })
      })
    }
  })
}

export async function detectPort(): Promise<{
  _id: string
  path: string
}> {
  return new Promise(async (resolve, reject) => {
    try {
      const ports: PortInfo[] = await SerialPort.list()
      for (let i: number = 0; i < ports.length; i++) {
        if (ports[i]) {
          const { serialNumber, path }: PortInfo = ports[i]
          const port: SerialPort = new SerialPort({
            path,
            autoOpen: false,
            baudRate: 9600,
            dataBits: 8,
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
          } else if (i === ports.length - 1) {
            reject()
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  })
}

export function sendSignal(payload: 'on' | 'off'): Promise<boolean> {
  return new Promise(async (resolve) => {
    try {
      if (!path) {
        const result: { _id: string, path: string } = await detectPort()
        path = result.path
      }
      if (!port) {
        port = new SerialPort({
          path,
          baudRate: 9600,
          dataBits: 8,
          parity: "none",
          stopBits: 1,
          lock: false
        }, async (e) => {
          if (e) resolve(false)
          resolve(await writeSignal(payload))
        })
      } else if (!port.isOpen) {
        port.open(async (e) => {
          if (e) resolve(false)
          resolve(await writeSignal(payload))
        })
      } else resolve(await writeSignal(payload))
    } catch (e) {
      resolve(false)
    }
  })
}

export async function initPort(init?: boolean): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    try {
      if (!path) {
        const result: { _id: string, path: string } = await detectPort()
        path = result.path
      }
      port = new SerialPort({
        path,
        baudRate: 9600,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
        lock: false,
        autoOpen: true
      }, async (e: Error) => {
        if (e) resolve(false)
        if (init) {
          await sendSignal('off')
          resolve(true)
        } else {
          resolve(true)
        }
      })
    } catch {
      resolve(false)
    }
  })
}