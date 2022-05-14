import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'
import Pomodoro from '../../../valueObjects/timer'

export type CancelBreakInput = void
export type CancelBreakOutput = void

export class CancelBreakUseCase
  implements UseCase<CancelBreakInput, CancelBreakOutput> {
  async execute () {
    const break = Container.get<Break>('break')

    break.cancel()
  }
}
