import { UseCase } from '../../../interfaces/UseCase'
import { SocketIoRealTimeProvider } from './../../../SocketIoRealTimeProvider'
import Timer from '../../../valueObjects/timer'

export type PausePomodoroInput = void
export type PausePomodoroOutput = void

export class PausePomodoroUseCase
  implements UseCase<PausePomodoroInput, PausePomodoroOutput> {
  constructor (
    private realTimeProvider: SocketIoRealTimeProvider,
    private pomodoro: Timer
  ) {}

  async execute () {
    this.pomodoro.pause()
    this.realTimeProvider.pausePomodoro()
  }
}
