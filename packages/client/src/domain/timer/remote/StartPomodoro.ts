import Timer from '../../../valueObjects/timer'
import { UseCase } from '../../../interfaces/UseCase'

export type RemoteStartPomodoroInput = number
export class RemoteStartPomodoroUseCase
  implements UseCase<RemoteStartPomodoroInput> {
  constructor (private pomodoro: Timer) {}

  async execute (delay: number) {
    this.pomodoro.duration = this.pomodoro.duration - delay
    this.pomodoro.start()
  }
}
