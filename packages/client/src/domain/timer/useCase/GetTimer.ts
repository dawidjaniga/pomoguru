import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'
import format from 'date-fns/format'
import { Publisher } from './../../../objects/publisher'
import Timer from '../../../valueObjects/timer'
import { Phase } from './../../../objects/model'

export type GetTimerInput = void

export type GetTimerOutput = {
  timeLeft: string
  progress: number
  phase: Phase
}

export class GetTimerUseCase extends Publisher
  implements UseCase<GetTimerInput, GetTimerOutput> {
  public isReactive = true
  private pomodoro: Timer
  private breakTimer: Timer

  constructor () {
    super()

    this.pomodoro = Container.get<Timer>('pomodoro')
    this.breakTimer = Container.get<Timer>('breakTimer')

    this.pomodoro.subscribe('updated', () => {
      this.publish('updated')
    })

    this.breakTimer.subscribe('updated', () => {
      this.publish('updated')
    })
  }

  async execute () {
    return {
      timeLeft: format(new Date(this.pomodoro.timeLeftMs), 'mm:ss'),
      progress: this.pomodoro.progress,
      phase: this.getPhase()
    }
  }

  getPhase () {
    let phase: Phase = 'idle'

    if (this.pomodoro.active) {
      phase = 'work'
    } else if (this.pomodoro.elapsed > 0) {
      phase = 'paused'
    } else if (this.breakTimer.active) {
      phase = 'break'
    }

    return phase
  }
}
