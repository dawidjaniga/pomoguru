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
