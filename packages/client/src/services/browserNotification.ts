import { Service } from 'typedi'
import { SystemNotificationService } from '../interfaces/SystemNotificationService'

@Service()
export class BrowserNotificationService implements SystemNotificationService {
  showNotification (title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        ...options,
        icon: BrowserNotificationService.getIcon()
      })
    }
  }

  static getIcon () {
    return 'data:image/png;base64,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'
  }
}
