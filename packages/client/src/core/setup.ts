import Container from 'typedi'

import { createUseCases } from './useCasesMap'
import setupDomains from '../core/setup/domains'

import { BrowserNotificationService } from '../services/BrowserNotification'
import { SocketIoRealTimeProvider } from '../SocketIoRealTimeProvider'
import { BrowserSoundService } from '../services/BrowserSoundService'

import {
  realTimeProviderToken,
  soundServiceToken,
  systemNotificationServiceToken,
  useCaseProviderToken
} from './tokens'

function setup () {
  setupDependencies()
  setupDomains()
}

function setupDependencies () {
  Container.set(useCaseProviderToken, createUseCases())
  Container.set(realTimeProviderToken, new SocketIoRealTimeProvider())
  Container.set(soundServiceToken, new BrowserSoundService())
  Container.set(
    systemNotificationServiceToken,
    new BrowserNotificationService()
  )
}

setup()
