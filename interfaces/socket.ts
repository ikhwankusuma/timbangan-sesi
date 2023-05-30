export interface WeighEmitSocket {
  'start': () => void
  'leave': () => void
  'disconnect': () => void
}

export interface WeighListenSocket {
  'update': (payload: {
    stable: boolean
    weight: number
    path: string
  }) => void
  'error': () => void
}