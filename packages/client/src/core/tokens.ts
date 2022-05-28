import { Token } from 'typedi'
import { SoundSerivce } from '../interfaces/SoundService'
import { SystemNotificationService } from '../interfaces/SystemNotificationService'
import { SocketIoRealTimeProvider } from '../SocketIoRealTimeProvider'

export const realTimeProviderToken = new Token<SocketIoRealTimeProvider>()
export const soundServiceToken = new Token<SoundSerivce>()
export const systemNotificationServiceToken = new Token<
  SystemNotificationService
>()
export const useCaseProviderToken = new Token()
// export const useCaseProviderToken = new Token<typeof useCaseProvider>()
