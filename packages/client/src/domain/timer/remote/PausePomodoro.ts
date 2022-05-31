import { UseCase } from '../../../interfaces/UseCase'

import Timer from '../../../valueObjects/timer'

export type PausePomodoroInput = void
export type PausePomodoroOutput = void

export class RemotePausePomodoroUseCase
  implements UseCase<PausePomodoroInput, PausePomodoroOutput> {
  constructor (private pomodoro: Timer) {}

  async execute () {
    this.pomodoro.pause()
  }
}
