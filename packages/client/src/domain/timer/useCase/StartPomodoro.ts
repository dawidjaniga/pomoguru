import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'
import Pomodoro from '../../../valueObjects/timer'

export class StartPomodoroUseCase implements UseCase {
  async execute () {
    console.log('execute start  pomodoro')
    const pomodoro = Container.get<Pomodoro>('pomodoro')

    pomodoro.start()
    console.log('pomodoro', pomodoro)
  }
}
