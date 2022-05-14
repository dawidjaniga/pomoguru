import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'
import Pomodoro from '../../../valueObjects/timer'

export class FinishPomodoroUseCase implements UseCase {
  async execute () {
    const pomodoro = Container.get<Pomodoro>('pomodoro')

    pomodoro.stop()
  }
}
