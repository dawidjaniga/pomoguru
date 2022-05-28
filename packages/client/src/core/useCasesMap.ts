// import { GetUserUseCase } from './../domain/user/useCases/GetUser'
// import { SkipPomodoroUseCase } from './../domain/timer/useCase/SkipPomodoro'
// import { PausePomodoroUseCase } from './../domain/timer/useCase/PausePomodoro'
// import { FinishBreakUseCase } from './../domain/timer/useCase/FinishBreak'
// import { FinishPomodoroUseCase } from './../domain/timer/useCase/FinishPomodoro'
// import { StartPomodoroUseCase } from './../domain/timer/useCase/StartPomodoro'
// import { GetTimersUseCase } from '../domain/timer/useCase/GetTimers'
// import { SkipBreakUseCase } from '../domain/timer/useCase/SkipBreak'
// import { LoginGoogleUseCase } from '../domain/user/useCases/LoginGoogle'

import { UseCase } from '../interfaces/UseCase'

export function createUseCases () {
  const useCasesMap: Record<string, UseCase> = {
    // 'timer.getTimers': new GetTimersUseCase(),
    // 'timer.startPomodoro': new StartPomodoroUseCase(),
    // 'timer.pausePomodoro': new PausePomodoroUseCase(),
    // 'timer.skipPomodoro': new SkipPomodoroUseCase(),
    // 'timer.skipBreak': new SkipBreakUseCase(),
    // 'timer.finishPomodoro': new FinishPomodoroUseCase(),
    // 'timer.finishBreak': new FinishBreakUseCase(),
    // 'user.getUser': new GetUserUseCase(),
    // 'user.loginGoogle': new LoginGoogleUseCase()
  }

  return useCasesMap
}

// export type UseCaseOutput<T extends UseCaseNames> = Awaited<
//   ReturnType<typeof useCasesMap[T]['execute']>
// >
