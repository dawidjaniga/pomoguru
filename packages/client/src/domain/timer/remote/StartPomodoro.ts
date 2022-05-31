import Timer from '../../../valueObjects/timer'
import { UseCase } from '../../../interfaces/UseCase'

export class RemoteStartPomodoroUseCase implements UseCase {
  constructor (private pomodoro: Timer) {}

  async execute () {
    this.pomodoro.start()
  }
}
