import Timer from '../../../valueObjects/timer'
import { UseCase } from '../../../interfaces/UseCase'

export class SkipBreakUseCase implements UseCase {
  constructor (private pomodoro: Timer, private breakTimer: Timer) {}

  async execute () {
    this.breakTimer.stop()
    this.pomodoro.start()

    // this.realTimeProvider.userSkipBreak()
  }
}
