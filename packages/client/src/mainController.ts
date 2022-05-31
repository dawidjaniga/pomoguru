import { Subject } from './objects/observer'
import { SystemNotificationService } from './interfaces/SystemNotificationService'

export type UserResponse = {
  id: string
  email: string
  avatarUrl: string
}

export class MainController extends Subject {
  constructor (public notificationService: SystemNotificationService) {
    super()
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
