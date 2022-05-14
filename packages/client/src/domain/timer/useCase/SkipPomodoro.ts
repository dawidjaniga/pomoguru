import { pomodoroToken } from './../setup'
import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'

export type SkipPomodoroInput = void
export type SkipPomodoroOutput = void

export class SkipPomodoroUseCase
  implements UseCase<SkipPomodoroInput, SkipPomodoroOutput> {
  async execute () {
    const pomodoro = Container.get(pomodoroToken)
    const pomodoroDuration = 1500

    pomodoro.stop()
    pomodoro.duration = pomodoroDuration
  }
}
