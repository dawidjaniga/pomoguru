import { Container } from 'inversify'
import { TYPES } from './types'

import { SystemNotificationService } from './../interfaces/SystemNotificationService'
import { BrowserNotificationService } from '../services/BrowserNotification'

const myContainer = new Container()
myContainer
  .bind<SystemNotificationService>(TYPES.Warrior)
  .to(BrowserNotificationService)

export { myContainer }
