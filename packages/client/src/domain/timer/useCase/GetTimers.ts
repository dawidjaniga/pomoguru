import Timer from '../../../valueObjects/timer'

import { UseCase } from '../../../interfaces/UseCase'
import format from 'date-fns/format'

import { Publisher } from '../../../objects/publisher'

export type Phase = 'idle' | 'work' | 'paused' | 'break'

export type GetTimerInput = void

export type GetTimerOutput = {
  timeLeft: string
  progress: number
  phase: Phase
}

export class GetTimersUseCase
  implements UseCase<GetTimerInput, GetTimerOutput> {
  public isReactive = true

  private publisher: Publisher = new Publisher()

  constructor (private pomodoro: Timer, private breakTimer: Timer) {
    this.pomodoro.subscribe('updated', async () => {
      this.publisher.publish('updated', await this.execute())
    })

    this.breakTimer.subscribe('updated', async () => {
      this.publisher.publish('updated', await this.execute())
    })
  }

  async execute () {
    const timer = this.timer

    return {
      progress: timer.progress,
      timeLeft: format(new Date(timer.timeLeftMs), 'mm:ss'),
      phase: this.phase
    }
  }

  // unsubscribe
  async subscribe (event: string, subscriber: (data: GetTimerOutput) => void) {
    this.publisher.subscribe(event, subscriber)
    subscriber(await this.execute())
  }

  get phase () {
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

  get timer () {
    const phaseToTimer: Record<Phase, Timer> = {
      idle: this.pomodoro,
      work: this.pomodoro,
      break: this.breakTimer,
      paused: this.pomodoro
    }

    return phaseToTimer[this.phase]
  }
}
