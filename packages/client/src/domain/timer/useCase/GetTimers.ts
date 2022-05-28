import { pomodoroToken, breakTimerToken } from './../setup'
import Container from 'typedi'
import { UseCase } from '../../../interfaces/UseCase'
import format from 'date-fns/format'
import { Publisher } from '../../../objects/publisher'
import Timer from '../../../valueObjects/timer'
import { Phase } from '../../../objects/model'

export type GetTimerInput = void

export type GetTimerOutput = {
  timeLeft: string
  progress: number
  phase: Phase
}

export class GetTimersUseCase extends Publisher
  implements UseCase<GetTimerInput, GetTimerOutput> {
  name = 'timer.getTimers'

  public isReactive = true

  private pomodoro: Timer
  private breakTimer: Timer

  constructor () {
    super()

    this.pomodoro = Container.get(pomodoroToken)
    this.breakTimer = Container.get(breakTimerToken)

    this.pomodoro.subscribe('updated', () => {
      this.publish('updated')
    })

    this.breakTimer.subscribe('updated', () => {
      this.publish('updated')
    })
  }

  async execute () {
    const timer = this.pomodoro.active ? this.pomodoro : this.breakTimer

    return {
      timeLeft: format(new Date(timer.timeLeftMs), 'mm:ss'),
      progress: timer.progress,
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
