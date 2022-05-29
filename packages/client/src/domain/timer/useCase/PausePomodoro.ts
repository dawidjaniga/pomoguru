import Timer from '../../../valueObjects/timer'
import { UseCase } from '../../../interfaces/UseCase'

export type PausePomodoroInput = void
export type PausePomodoroOutput = void

export class PausePomodoroUseCase
  implements UseCase<PausePomodoroInput, PausePomodoroOutput> {
  constructor (private pomodoro: Timer) {}

  async execute () {
    this.pomodoro.pause()
  }
}
