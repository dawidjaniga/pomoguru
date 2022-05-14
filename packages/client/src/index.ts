import { SystemNotificationService } from './interfaces/SystemNotificationService'
import 'reflect-metadata'
import { BrowserNotificationService } from './services/browserNotification'
import { Model } from './objects/model'
import { SocketIoRealTimeProvider } from './SocketIoRealTimeProvider'
import { MainController } from './mainController'
import Timer from './valueObjects/timer'
import Container, { Token } from 'typedi'
import { SoundSerivce } from './interfaces/SoundService'
import { BrowserSoundService } from './services/BrowserSoundService'

export const soundServiceToken = new Token<SoundSerivce>()
export const systemNotificationServiceToken = new Token<
  SystemNotificationService
>()

Container.set(soundServiceToken, new BrowserSoundService())
Container.set(systemNotificationServiceToken, new BrowserNotificationService())

export const controller = new MainController(
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
