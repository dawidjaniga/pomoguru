import { SocketIoRealTimeProvider } from './SocketIoRealTimeProvider'
import { Subject } from './objects/observer'
import { Model } from './objects/model'
import { SystemNotificationService } from './interfaces/SystemNotificationService'
import debugModule from 'debug'

const debug = debugModule('pomoguru:client:mainController')

export type UserResponse = {
  id: string
  email: string
  avatarUrl: string
}

const apiUrl = process.env['NX_POMOGURU_API_URL']

export class MainController extends Subject {
  constructor (
    public model: Model,
    public realTimeProvider: SocketIoRealTimeProvider,
    public notificationService: SystemNotificationService
  ) {
    super()

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

  // @TODO: Remove
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

  // @TODO: Move to Browser Notification Service
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
}
