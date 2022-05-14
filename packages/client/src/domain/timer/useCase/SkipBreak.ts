import { breakTimerToken, pomodoroToken } from './../setup'
import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'

export class SkipBreakUseCase implements UseCase {
  async execute () {
    const breakTimer = Container.get(breakTimerToken)
    const pomodoro = Container.get(pomodoroToken)

    breakTimer.stop()
    pomodoro.start()

    // this.realTimeProvider.userSkipBreak()
  }
}
