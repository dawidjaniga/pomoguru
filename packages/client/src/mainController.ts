import { StartPomodoroUseCase } from './domain/timer/useCase/StartPomodoro'
import { SocketIoRealTimeProvider } from './SocketIoRealTimeProvider'
import Interval from './interval'
import { Subject } from './objects/observer'
import { Model } from './objects/model'
import { SystemNotificationService } from './interfaces/SystemNotificationService'
import { SoundSerivce } from './interfaces/SoundService'
import Timer from './valueObjects/timer'
import Container from 'typedi'
import debugModule from 'debug'

const debug = debugModule('pomoguru:client:mainController')

// @TODO: Extract to Settings Object
const pomodoroDuration = 25 * 60
const breakDuration = 5 * 60

export type UserResponse = {
  id: string
  email: string
  avatarUrl: string
}

const apiUrl = process.env['NX_POMOGURU_API_URL']

export class MainController extends Subject {
  private pomodoro: Timer | null = null

  constructor (
    public interval: Interval,
    public timer: Timer,
    public model: Model,
    public realTimeProvider: SocketIoRealTimeProvider,
    public notificationService: SystemNotificationService,
    public soundService: SoundSerivce
  ) {
    super()

    const pomodoro = new Timer()
    pomodoro.duration = pomodoroDuration
    Container.set('pomodoro', pomodoro)

    const breakTimer = new Timer()
    breakTimer.duration = breakDuration
    Container.set('breakTimer', breakTimer)

    // @TODO: 1
    this.model.set('phase', 'idle')
    this.model.set('workDuration', pomodoroDuration)
    this.model.set('breakDuration', breakDuration)

    if (typeof window !== 'undefined') {
      this.getUser()
      this.model.set(
        'notificationsAllowed',
        Notification.permission === 'granted'
      )
    }
  }

  async loginGoogle (jwtToken: string) {
    await fetch(apiUrl + '/login/google', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwtToken
      })
    })
  }

  async authorizeSlack (code: string) {
    await fetch(apiUrl + '/slack/authorize', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code
      })
    })
  }

  async getUser () {
    try {
      this.realTimeProvider.subscribe('user:authorized', user => {
        debug('user authorized', user)

        this.model.set('user', {
          userId: user.id,
          email: user.email,
          avatarUrl: user.avatarUrl
        })
      })

      // this.realTimeProvider.subscribe(
      //   'remoteStartedTimer',
      //   (occuredAt: number) => {
      //     this.remoteStartWork(occuredAt)
      //   }
      // )

      // this.realTimeProvider.subscribe('pomodoroPaused', () => {
      //   if (this.model.get('phase') !== 'paused') {
      //     this.pausePomodoro()
      //   }
      // })

      // this.realTimeProvider.subscribe('breakSkipped', () => {
      //   if (this.model.get('phase') !== 'break') {
      //     this.skipBreak()
      //   }
      // })

      // this.realTimeProvider.subscribe('workCanceled', () => {
      //   if (this.model.get('phase') === 'paused') {
      //     this.cancelWork()
      //   }
      // })
    } catch (e) {
      console.error('getUser error', e)
    }
  }

  startWork () {
    this.model.set('phase', 'work')

    this.pomodoro = Container.get<Timer>('pomodoro')
    this.pomodoro.duration = pomodoroDuration
    // this.pomodoro.onFinish = () => {
    //   this.soundService.playWorkEndSound()
    //   this.notificationService.showNotification('Break Time')
    //   this.model.set('phase', 'break')
    //   this.timer.secondsDuration = breakDuration

    //   // start break
    // }

    this.pomodoro.start()

    // this.realTimeProvider.startUserWork()
  }

  // remoteStartWork (occuredAt: number) {
  //   if (this.model.get('phase') === 'work') {
  //     return
  //   }

  //   this.model.set('phase', 'work')

  //   const timeElapsedFromRemoteEvent = Date.now() - occuredAt
  //   const fullSecondsElapsedFromRemoteEvent =
  //     Math.ceil(timeElapsedFromRemoteEvent / 1000) * 1000
  //   const waitFor =
  //     fullSecondsElapsedFromRemoteEvent - timeElapsedFromRemoteEvent

  //   this.timer.secondsDuration =
  //     pomodoroDuration - fullSecondsElapsedFromRemoteEvent / 1000
  //   this.model.setTimeLeft(this.timer.elapsedSeconds)

  //   debug('remoteStartWork', {
  //     occuredAt,
  //     now: Date.now(),
  //     timeElapsedFromRemoteEvent,
  //     fullSecondsElapsedFromRemoteEvent,
  //     waitFor,
  //     workDuration: pomodoroDuration,
  //     secondsDuration: this.timer.secondsDuration
  //   })

  //   setTimeout(() => {
  //     debug('remoteStartWork waited.')
  //     this.interval.start()
  //   }, waitFor)
  // }

  pausePomodoro () {
    this.model.set('phase', 'paused')
    this.pomodoro = Container.get<Timer>('pomodoro')
  }

  skipBreak () {
    // this.timer.reset()
    // this.model.set('phase', 'work')
    // this.timer.secondsDuration = pomodoroDuration
    // this.realTimeProvider.userSkipBreak()
  }

  cancelWork () {
    // this.timer.reset()
    // this.model.set('phase', 'idle')
    // this.model.setTimeLeft(this.timer.elapsedSeconds)
    // this.realTimeProvider.userCancelWork()
  }

  async allowNotifications () {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        this.notificationService.showNotification(
          'Notifications already turned on'
        )
      } else {
        const permission = await Notification.requestPermission()

        if (permission === 'granted') {
          this.notificationService.showNotification('Notifications turned on')
        }

        if (permission === 'denied') {
          console.warn('Notifications denied')
        }
      }
    } else {
      console.error('Your browser does not support notifications')
    }
  }

  // onTimerFinished () {
  //   const phase = this.model.get('phase')
  //   this.interval.stop()
  //   this.timer.reset()

  //   if (phase === 'work') {
  //     this.soundService.playWorkEndSound()
  //     this.notificationService.showNotification('Break Time')
  //     this.model.set('phase', 'break')
  //     this.timer.secondsDuration = breakDuration
  //   }

  //   if (phase === 'break') {
  //     this.soundService.playBreakEndSound()
  //     this.notificationService.showNotification('Focus time')
  //     this.model.set('phase', 'work')
  //     this.timer.secondsDuration = pomodoroDuration
  //   }

  //   this.interval.start()
  // }
}
