import Timer from '../valueObjects/timer'

import { SoundService } from '../interfaces/SoundService'
import { SystemNotificationService } from '../interfaces/SystemNotificationService'

import { SocketIoRealTimeProvider } from '../SocketIoRealTimeProvider'
import { User } from '../domain/user/entities/user'
import { UseCaseManger } from './useCaseManger'

import { GetUserOutput } from '../domain/user/useCases/GetUser'
import { GetTimerOutput } from '../domain/timer/useCase/GetTimers'
import { PomoguruApi } from '../services/pomoguruApi'
import { EventSynchronizer } from '../objects/eventSynchronizer'

// @TODO: Extract to Settings Object. Check where those are used.
// export const pomodoroDuration = 5
// export const breakDuration = 5
export const pomodoroDuration = 25 * 60
export const breakDuration = 5 * 60

export class PomoguruClient {
  private useCases: Record<string, any> = {}
  private objects: Record<string, any> = {}
  private pomoguruApi: PomoguruApi
  private realTimeProvider: SocketIoRealTimeProvider

  constructor (
    private soundService: SoundService,
    private systemNotificationService: SystemNotificationService
  ) {
    this.createObjects()

    this.pomoguruApi = new PomoguruApi(
      process.env['NX_POMOGURU_API_URL'] as string
    )
    this.realTimeProvider = new SocketIoRealTimeProvider()
    this.useCases = new UseCaseManger(
      this.objects,
      this.pomoguruApi,
      this.soundService,
      this.realTimeProvider,
      this.systemNotificationService
    ).useCases

    this.attachEvents()
  }

  createObjects () {
    this.objects['pomodoro'] = new Timer()
    this.objects['pomodoro'].duration = pomodoroDuration

    this.objects['breakTimer'] = new Timer()
    this.objects['breakTimer'].duration = breakDuration

    this.objects['user'] = new User()
  }

  attachEvents () {
    this.objects['pomodoro'].subscribe('finished', async () => {
      this.useCases['timer.finishPomodoro'].execute()
    })

    this.objects['breakTimer'].subscribe('finished', async () => {
      this.useCases['timer.finishBreak'].execute()
    })

    this.realTimeProvider.subscribe('pomodoroStarted', (createdAt: number) => {
      console.log('pomodoro started')
      EventSynchronizer.syncToCurrentSecond(createdAt, delay => {
        this.useCases['timer.remoteStartPomodoro'].execute(delay)
      })
    })

    this.realTimeProvider.subscribe('pomodoroPaused', () => {
      console.log('pomodoro paused')
      this.useCases['timer.remotePausePomodoro'].execute()
    })

    this.realTimeProvider.subscribe('pomodoroSkipped', () => {
      this.useCases['timer.remoteSkipPomodoro'].execute()
    })

    this.realTimeProvider.subscribe('breakSkipped', () => {
      this.useCases['timer.remoteSkipBreak'].execute()
    })
  }

  startPomodoro () {
    this.useCases['timer.startPomodoro'].execute()
  }

  pausePomodoro () {
    this.useCases['timer.pausePomodoro'].execute()
  }

  skipPomodoro () {
    this.useCases['timer.skipPomodoro'].execute()
  }

  skipBreak () {
    this.useCases['timer.skipBreak'].execute()
  }

  subscribeToGetTimers (cb: (timers: GetTimerOutput) => void) {
    this.useCases['timer.getTimers'].subscribe('updated', cb)
  }

  subscribeToGetUser (cb: (user: GetUserOutput) => void) {
    this.useCases['user.getUser'].subscribe('updated', cb)
  }

  loginGoogle (token: string) {
    this.useCases['user.loginGoogle'].execute(token)
  }

  authorizeSlack (token: string) {
    this.useCases['user.authorizeSlack'].execute(token)
  }
}
