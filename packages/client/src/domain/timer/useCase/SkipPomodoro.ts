import { SocketIoRealTimeProvider } from './../../../SocketIoRealTimeProvider'
import Timer from '../../../valueObjects/timer'
import { UseCase } from '../../../interfaces/UseCase'

export type SkipPomodoroInput = void
export type SkipPomodoroOutput = void

export class SkipPomodoroUseCase
  implements UseCase<SkipPomodoroInput, SkipPomodoroOutput> {
  constructor (
    private realTimeProvider: SocketIoRealTimeProvider,
    private pomodoro: Timer
  ) {}

  async execute () {
    const pomodoroDuration = 1500

    this.pomodoro.stop()
    this.pomodoro.duration = pomodoroDuration
    this.realTimeProvider.skipPomodoro()
  }
}
