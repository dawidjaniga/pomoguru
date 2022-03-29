import { BrowserNotificationService } from './services/browserNotification'
import Interval from './interval'
import Timer from './timer'
import { Model } from './objects/model'
import { SocketIoRealTimeProvider } from './SocketIoRealTimeProvider'
import { MainController } from './mainController'

export const controller = new MainController(
  new Interval(),
  new Timer(),
  new Model(),
  new SocketIoRealTimeProvider(),
  new BrowserNotificationService()
)

export const model = controller.model

// prettier-ignore
export type { TimeLeft, Phase } from './objects/model'
export * from './react'
export * from './login/google'
