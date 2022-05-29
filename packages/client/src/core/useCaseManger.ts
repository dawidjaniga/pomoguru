import { SystemNotificationService } from '@pomoguru/client'
import { SocketIoRealTimeProvider } from './../SocketIoRealTimeProvider'
import { GetUserUseCase } from '../domain/user/useCases/GetUser'
import { SkipPomodoroUseCase } from '../domain/timer/useCase/SkipPomodoro'
import { PausePomodoroUseCase } from '../domain/timer/useCase/PausePomodoro'
import { FinishBreakUseCase } from '../domain/timer/useCase/FinishBreak'
import { FinishPomodoroUseCase } from '../domain/timer/useCase/FinishPomodoro'
import { StartPomodoroUseCase } from '../domain/timer/useCase/StartPomodoro'
import { GetTimersUseCase } from '../domain/timer/useCase/GetTimers'
import { SkipBreakUseCase } from '../domain/timer/useCase/SkipBreak'
import { LoginGoogleUseCase } from '../domain/user/useCases/LoginGoogle'
import { SoundService } from '../interfaces/SoundService'

export class UseCaseManger {
  public useCases: Record<string, any> = {}

  constructor (
    objects: Record<string, any>,
    soundService: SoundService,
    realTimeProvider: SocketIoRealTimeProvider,
    systemNotificationService: SystemNotificationService
  ) {
    this.useCases = {
      'timer.getTimers': new GetTimersUseCase(
        objects['pomodoro'],
        objects['breakTimer']
      ),
      'timer.startPomodoro': new StartPomodoroUseCase(
        realTimeProvider,
        objects['pomodoro']
      ),
      'timer.pausePomodoro': new PausePomodoroUseCase(objects['pomodoro']),
      'timer.skipPomodoro': new SkipPomodoroUseCase(objects['pomodoro']),
      'timer.skipBreak': new SkipBreakUseCase(
        objects['pomodoro'],
        objects['breakTimer']
      ),
      'timer.finishPomodoro': new FinishPomodoroUseCase(
        soundService,
        systemNotificationService,
        objects['pomodoro']
      ),
      'timer.finishBreak': new FinishBreakUseCase(
        soundService,
        systemNotificationService,
        objects['breakTimer']
      ),
      'user.getUser': new GetUserUseCase(realTimeProvider, objects['user']),
      'user.loginGoogle': new LoginGoogleUseCase()
    }
  }
}
