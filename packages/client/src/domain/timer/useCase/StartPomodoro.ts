import Timer from '../../../valueObjects/timer'
import { UseCase } from '../../../interfaces/UseCase'

export class StartPomodoroUseCase implements UseCase {
  constructor (private pomodoro: Timer) {}

  async execute () {
    this.pomodoro.start()
    // create pomodoro on BE / call PomoguruApi
    // this.realTimeProvider.startUserWork()
  }
}
