import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'
import Pomodoro from '../../../valueObjects/timer'

export type PausePomodoroInput = void
export type PausePomodoroOutput = void

export class PausePomodoroUseCase
  implements UseCase<PausePomodoroInput, PausePomodoroOutput> {
  async execute () {
    const pomodoro = Container.get<Pomodoro>('pomodoro')

    pomodoro.pause()
  }
}
