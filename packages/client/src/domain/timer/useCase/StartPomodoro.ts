import { pomodoroToken } from './../setup'
import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'

export class StartPomodoroUseCase implements UseCase {
  async execute () {
    const pomodoro = Container.get(pomodoroToken)

    pomodoro.start()
    // create pomodoro on BE / call PomoguruApi
    // this.realTimeProvider.startUserWork()
  }
}
