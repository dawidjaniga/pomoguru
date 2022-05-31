export interface ClientToServerEvents {
  startPomodoro: (occuredAt: number) => void
  pausePomodoro: (occuredAt: number) => void
  skipPomodoro: (occuredAt: number) => void
}

export interface ServerToClientEvents {
  pomodoroStarted: () => void
  pomodoroPaused: () => void
  basicEmit: (a: number, b: string, c: Buffer) => void
  withAck: (d: string, callback: (e: number) => void) => void
}

interface SocketData {
  name: string
  age: number
}
