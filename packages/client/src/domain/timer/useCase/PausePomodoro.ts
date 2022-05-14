import { pomodoroToken } from './../setup'
import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'

export type PausePomodoroInput = void
export type PausePomodoroOutput = void

export class PausePomodoroUseCase
  implements UseCase<PausePomodoroInput, PausePomodoroOutput> {
  async execute () {
    const pomodoro = Container.get(pomodoroToken)

    pomodoro.pause()
  }
}
