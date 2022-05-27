import { UserDomain } from './domain/user/setup'
import 'reflect-metadata'
import { SystemNotificationService } from './interfaces/SystemNotificationService'
import { BrowserNotificationService } from './services/BrowserNotification'
import { Model } from './objects/model'
import { SocketIoRealTimeProvider } from './SocketIoRealTimeProvider'
import { MainController } from './mainController'

import Container, { Token } from 'typedi'
import { SoundSerivce } from './interfaces/SoundService'
import { BrowserSoundService } from './services/BrowserSoundService'
import { UseCaseNames, useCaseProvider } from './core/useCasesMap'
import { TimerDomain } from './domain/timer/setup'

export const useCaseProviderToken = new Token<typeof useCaseProvider>()
export const realTimeProviderToken = new Token<SocketIoRealTimeProvider>()
export const soundServiceToken = new Token<SoundSerivce>()
export const systemNotificationServiceToken = new Token<
  SystemNotificationService
>()

Container.set(useCaseProviderToken, useCaseProvider)
Container.set(realTimeProviderToken, new SocketIoRealTimeProvider())
Container.set(soundServiceToken, new BrowserSoundService())
Container.set(systemNotificationServiceToken, new BrowserNotificationService())

function setupDomains () {
  new TimerDomain()
  new UserDomain()
}

setupDomains()

export const controller = new MainController(
  new Model(),
  new SocketIoRealTimeProvider(),
  new BrowserNotificationService()
)

export const model = controller.model

// prettier-ignore
export type { TimeLeft, Phase } from './objects/model'
export * from './react'
export * from './login/google'

// Public API
export { useCaseProvider, UseCaseNames }
