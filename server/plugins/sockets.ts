import { Server as HTTPServer } from 'http'
import { SerialPort } from 'serialport';
import { Namespace, Server } from "socket.io";

import { WeighListenSocket, WeighEmitSocket } from '../interfaces/socket';
import { refreshPort } from './ports';
import { detectPort } from './weighs';

let port: SerialPort = null
let path: string = ''
let stable: boolean = false
let timeoutError: NodeJS.Timeout = null
let timeoutStable: NodeJS.Timeout = null

export function initSocket(server: HTTPServer, allowed_url: string[] = []): void {
  const io: Server = new Server(server, {
    cors: {
      origin: allowed_url
    }
  })

  const weighNSP: Namespace<WeighListenSocket, WeighEmitSocket> = io.of('/weigh')

  weighNSP.on('connection', (socket) => {
    socket.on('start', async () => {
      try {
        await refreshPort()
        if (!path) {
          const result: { _id: string, path: string } = await detectPort()
          path = result.path
        }
        stable = false
        let str: string = ''
        let prevWeight: number = 0
        port = new SerialPort({
          path,
          baudRate: 2400,
          dataBits: 7,
          parity: 'none',
          stopBits: 1,
          lock: false
        })
        port.on('data', (data: Buffer) => {
          clearTimeout(timeoutError)
          timeoutError = setTimeout(() => {
            weighNSP.emit('error')
          }, 2500);
          str += data.toString()
          if (/\r\n/.exec(str)) {
            let rawWeight: string = str.trim()
            str = ''
            if (rawWeight) {
              const regExpArr: RegExpMatchArray = rawWeight.match(/((\+|\-) *(\d+\.\d+|\d+|\d+\.+\w+)([a-z|A-Z]+| *[a-z|A-Z]+))/g)
              if (regExpArr?.length >= 1) {
                const weight: number = parseFloat(regExpArr[0].replace(/ /g, ''))
                if (weight !== prevWeight) {
                  prevWeight = weight
                  timeoutStable = setTimeout(() => {
                    stable = true
                  }, 500);
                } else {
                  clearTimeout(timeoutStable)
                }
                weighNSP.emit('update', {
                  path,
                  weight: Math.floor(weight),
                  stable: rawWeight.includes('ST')
                })
              }
            }
          }
        })
      } catch (e) {
        console.log(e)
        weighNSP.emit('error')
      }
    })
    socket.on('leave', () => {
      try {
        if (port && port.isOpen) {
          port.close()
        }
      } catch { }
    })
  })
}