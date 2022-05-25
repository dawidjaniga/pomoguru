import { ObjectPool } from './objectPool'
import { SkipPomodoroUseCase } from './../domain/timer/useCase/SkipPomodoro'
import { PausePomodoroUseCase } from './../domain/timer/useCase/PausePomodoro'
import { FinishBreakUseCase } from './../domain/timer/useCase/FinishBreak'
import { FinishPomodoroUseCase } from './../domain/timer/useCase/FinishPomodoro'
import { StartPomodoroUseCase } from './../domain/timer/useCase/StartPomodoro'
import { GetTimersUseCase } from '../domain/timer/useCase/GetTimers'
import { SkipBreakUseCase } from '../domain/timer/useCase/SkipBreak'

const useCasesMap = {
  'timer.getTimers': GetTimersUseCase,
  'timer.startPomodoro': StartPomodoroUseCase,
  'timer.pausePomodoro': PausePomodoroUseCase,
  'timer.skipPomodoro': SkipPomodoroUseCase,
  'timer.skipBreak': SkipBreakUseCase,
  'timer.finishPomodoro': FinishPomodoroUseCase,
  'timer.finishBreak': FinishBreakUseCase
}

export type UseCaseNames = keyof typeof useCasesMap

export const useCaseProvider = new ObjectPool<typeof useCasesMap>(useCasesMap)
