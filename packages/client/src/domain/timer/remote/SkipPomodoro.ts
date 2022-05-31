import Timer from '../../../valueObjects/timer'
import { UseCase } from '../../../interfaces/UseCase'
import { pomodoroDuration } from '../../../core/pomoguruClient'

export type SkipPomodoroInput = void
export type SkipPomodoroOutput = void

export class RemoteSkipPomodoroUseCase
  implements UseCase<SkipPomodoroInput, SkipPomodoroOutput> {
  constructor (private pomodoro: Timer) {}

  async execute () {
    // @TODO: Use Settings after extraction

    this.pomodoro.stop()
    this.pomodoro.duration = pomodoroDuration
  }
}
