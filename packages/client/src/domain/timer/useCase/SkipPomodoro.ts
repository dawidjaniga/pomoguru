import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'
import Pomodoro from '../../../valueObjects/timer'

export type SkipPomodoroInput = void
export type SkipPomodoroOutput = void

export class SkipPomodoroUseCase
  implements UseCase<SkipPomodoroInput, SkipPomodoroOutput> {
  async execute () {
    const pomodoro = Container.get<Pomodoro>('pomodoro')
    const pomodoroDuration = 1500

    pomodoro.stop()
    pomodoro.duration = pomodoroDuration
  }
}
