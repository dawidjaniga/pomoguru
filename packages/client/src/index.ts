import 'reflect-metadata'

export { SystemNotificationService } from './interfaces/SystemNotificationService'
export { SoundService } from './interfaces/SoundService'

import { PomoguruClient } from './core/pomoguruClient'
// import { useCaseProvider } from './core/setup'

// Public @pomoguru/client API
// type UseCaseNames = keyof typeof useCaseProvider
// export { useCaseProvider, UseCaseNames }

export { PomoguruClient }
export { Phase, GetTimerOutput } from './domain/timer/useCase/GetTimers'
export { GetUserOutput } from './domain/user/useCases/GetUser'

// export * from './react'
// export * from './login/google'
