import { UserDomain } from '../domain/user/setup'
import 'reflect-metadata'
import { SystemNotificationService } from '../interfaces/SystemNotificationService'
import { BrowserNotificationService } from '../services/BrowserNotification'

import { SocketIoRealTimeProvider } from '../SocketIoRealTimeProvider'

import Container, { Token } from 'typedi'
import { SoundSerivce } from '../interfaces/SoundService'
import { BrowserSoundService } from '../services/BrowserSoundService'
import { TimerDomain } from '../domain/timer/setup'

export const realTimeProviderToken = new Token<SocketIoRealTimeProvider>()
export const soundServiceToken = new Token<SoundSerivce>()
export const systemNotificationServiceToken = new Token<
  SystemNotificationService
>()

function setup () {
  new TimerDomain()
  new UserDomain()

  Container.set(realTimeProviderToken, new SocketIoRealTimeProvider())
  Container.set(soundServiceToken, new BrowserSoundService())
  Container.set(
    systemNotificationServiceToken,
    new BrowserNotificationService()
  )
}

setup()
