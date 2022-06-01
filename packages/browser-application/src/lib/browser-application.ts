import { Application } from '@pomoguru/client'
import { BrowserNotificationService } from './../services/BrowserNotification'
import { BrowserSoundService } from '../services/BrowserSoundService'

export function createBrowserApplication () {
  return new Application(
    new BrowserSoundService(),
    new BrowserNotificationService()
  )
}
