import { FinishPomodoroUseCase } from './useCase/FinishPomodoro'
import Container, { Token } from 'typedi'
import Timer from '../../valueObjects/timer'
import { FinishBreakUseCase } from './useCase/FinishBreak'

// @TODO: Extract to Settings Object
// const pomodoroDuration = 25 * 60
// const breakDuration = 5 * 60
const pomodoroDuration = 3
const breakDuration = 3

export const pomodoroToken = new Token<Timer>()
export const breakTimerToken = new Token<Timer>()

export class UserDomain {
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

  async startPomodoro (): Promise<void> {
    // Code Splitting?
    // const useCase = await import(
    //   'packages/client/src/domain/timer/useCase/GetTimers'
    // )
    // const conrecte = new useCase()
    // conrecte.execute()
  }

  private attachEvents () {
    this.pomodoro.subscribe('finished', async () => {
      const finishUseCase = new FinishPomodoroUseCase()
      await finishUseCase.execute()
    })

    this.breakTimer.subscribe('finished', async () => {
      const finishUseCase = new FinishBreakUseCase()
      await finishUseCase.execute()
    })
  }
}
