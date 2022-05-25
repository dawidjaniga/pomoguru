import Container, { Token } from 'typedi'
import { useCaseProviderToken } from '@pomoguru/client'
import Timer from '../../valueObjects/timer'

// @TODO: Extract to Settings Object
// const pomodoroDuration = 25 * 60
// const breakDuration = 5 * 60
const pomodoroDuration = 3
const breakDuration = 3

export const pomodoroToken = new Token<Timer>()
export const breakTimerToken = new Token<Timer>()
export class TimerDomain {
  private pomodoro: Timer
  private breakTimer: Timer

  constructor () {
    this.pomodoro = new Timer()
    this.pomodoro.duration = pomodoroDuration
    Container.set(pomodoroToken, this.pomodoro)

    this.breakTimer = new Timer()
    this.breakTimer.duration = breakDuration
    Container.set(breakTimerToken, this.breakTimer)

    this.attachEvents()
  }

  attachEvents () {
    const provider = Container.get(useCaseProviderToken)

    this.pomodoro.subscribe('finished', async () => {
      // @ts-ignore
      await provider.get('timer.finishPomodoro').execute()
    })

    this.breakTimer.subscribe('finished', async () => {
      // @ts-ignore
      await provider.get('timer.finishBreak').execute()
    })
  }
}
