import { UseCase } from '../../../interfaces/UseCase'
import Timer from '../../../valueObjects/timer'

export type FastForwardInput = void
export type FastForwardOutput = void

const secondsToFinish = 5

export class FastForwardUseCase
  implements UseCase<FastForwardInput, FastForwardOutput> {
  constructor (private pomodoro: Timer, private breakTimer: Timer) {}

  async execute () {
    const timer = this.pomodoro.active ? this.pomodoro : this.breakTimer

    timer.elapsed = timer.duration - secondsToFinish
  }
}
