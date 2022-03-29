import { BrowserNotificationService } from './services/browserNotification'
import Interval from './interval'
import Timer from './timer'
import { Model } from './objects/model'
import { SocketIoRealTimeProvider } from './SocketIoRealTimeProvider'
import { MainController } from './mainController'
import { BrowserSoundService } from './services/BrowserSoundService'

export const controller = new MainController(
  new Interval(),
  new Timer(),
  new Model(),
  new SocketIoRealTimeProvider(),
  new BrowserNotificationService(),
  new BrowserSoundService()
)

export const model = controller.model

// prettier-ignore
export type { TimeLeft, Phase } from './objects/model'
export * from './react'
export * from './login/google'
