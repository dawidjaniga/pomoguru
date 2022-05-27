import { GetUserUseCase } from './../domain/user/useCases/GetUser'
import { SkipPomodoroUseCase } from './../domain/timer/useCase/SkipPomodoro'
import { PausePomodoroUseCase } from './../domain/timer/useCase/PausePomodoro'
import { FinishBreakUseCase } from './../domain/timer/useCase/FinishBreak'
import { FinishPomodoroUseCase } from './../domain/timer/useCase/FinishPomodoro'
import { StartPomodoroUseCase } from './../domain/timer/useCase/StartPomodoro'
import { GetTimersUseCase } from '../domain/timer/useCase/GetTimers'
import { SkipBreakUseCase } from '../domain/timer/useCase/SkipBreak'

const useCasesMap = {
  'timer.getTimers': new GetTimersUseCase(),
  'timer.startPomodoro': new StartPomodoroUseCase(),
  'timer.pausePomodoro': new PausePomodoroUseCase(),
  'timer.skipPomodoro': new SkipPomodoroUseCase(),
  'timer.skipBreak': new SkipBreakUseCase(),
  'timer.finishPomodoro': new FinishPomodoroUseCase(),
  'timer.finishBreak': new FinishBreakUseCase(),
  'user.getUser': new GetUserUseCase()
} as const

export type UseCaseNames = keyof typeof useCasesMap
export type UseCases = typeof useCasesMap[UseCaseNames]
export type UseCaseInput<T extends UseCaseNames> = Parameters<
  typeof useCasesMap[T]['execute']
>
export type UseCaseOutput<T extends UseCaseNames> = Awaited<
  ReturnType<typeof useCasesMap[T]['execute']>
>

export const useCaseProvider = {
  get (name: UseCaseNames) {
    return useCasesMap[name]
  }
}

// export const ÷useCaseProvider = new ObjectPool<typeof useCasesMap>(useCasesMap)
