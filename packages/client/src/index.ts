import 'reflect-metadata'
import './core/setup'
import Container, { Token } from 'typedi'
import { UseCaseNames, useCaseProvider } from './core/useCasesMap'
import { SocketIoRealTimeProvider } from './SocketIoRealTimeProvider'
import { SoundSerivce } from './interfaces/SoundService'
import { SystemNotificationService } from './interfaces/SystemNotificationService'

export const realTimeProviderToken = new Token<SocketIoRealTimeProvider>()
export const soundServiceToken = new Token<SoundSerivce>()
export const systemNotificationServiceToken = new Token<
  SystemNotificationService
>()

export const useCaseProviderToken = new Token<typeof useCaseProvider>()
Container.set(useCaseProviderToken, useCaseProvider)

// Public API
export { useCaseProvider, UseCaseNames }

export * from './react'
export * from './login/google'
