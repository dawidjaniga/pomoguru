import { SocketIoRealTimeProvider } from './../../../SocketIoRealTimeProvider'
import Timer from '../../../valueObjects/timer'
import { UseCase } from '../../../interfaces/UseCase'

export class StartPomodoroUseCase implements UseCase {
  constructor (
    private realTimeProvider: SocketIoRealTimeProvider,
    private pomodoro: Timer
  ) {}

  async execute () {
    this.pomodoro.start()
    this.realTimeProvider.startPomodoro()
  }
}
