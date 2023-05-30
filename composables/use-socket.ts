
import { io, Socket } from 'socket.io-client'
import { WeighEmitSocket, WeighListenSocket } from '~~/interfaces/socket'

export default function () {
  const config = useRuntimeConfig()

  const socketWeigh = useState<Socket<WeighListenSocket, WeighEmitSocket>>('socket-weigh', () => null)

  const initSocket = (): void => {
    socketWeigh.value = io(`${config.public.apiBase}/weigh`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    })
  }

  return { socketWeigh, initSocket }
}