export interface WeighListenSocket {
  'start': () => void
  'leave': () => void
  'disconnect': () => void
}

export interface WeighEmitSocket {
  'update': (payload: {
    stable: boolean
    weight: number
    path: string
  }) => void
  'error': () => void
}