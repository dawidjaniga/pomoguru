import { RemoteSkipBreakUseCase } from './../domain/timer/remote/SkipBreak'
import { RemoteSkipPomodoroUseCase } from './../domain/timer/remote/SkipPomodoro'
import { PomoguruApi } from 'packages/client/src/services/pomoguruApi'
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
import { AuthorizeSlackUseCase } from '../domain/user/useCases/AuthorizeSlack'
import { RemoteStartPomodoroUseCase } from '../domain/timer/remote/StartPomodoro'
import { RemotePausePomodoroUseCase } from '../domain/timer/remote/PausePomodoro'
import { FastForwardUseCase } from '../domain/timer/useCase/FastForward'

export class UseCaseManger {
  public useCases: Record<string, any> = {}

  constructor (
    objects: Record<string, any>,
    pomoguruApi: PomoguruApi,
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
      'timer.remoteStartPomodoro': new RemoteStartPomodoroUseCase(
        objects['pomodoro']
      ),
      'timer.pausePomodoro': new PausePomodoroUseCase(
        realTimeProvider,
        objects['pomodoro']
      ),
      'timer.remotePausePomodoro': new RemotePausePomodoroUseCase(
        objects['pomodoro']
      ),
      'timer.skipPomodoro': new SkipPomodoroUseCase(
        realTimeProvider,
        objects['pomodoro']
      ),
      'timer.remoteSkipPomodoro': new RemoteSkipPomodoroUseCase(
        objects['pomodoro']
      ),
      'timer.skipBreak': new SkipBreakUseCase(
        realTimeProvider,
        objects['pomodoro'],
        objects['breakTimer']
      ),
      'timer.remoteSkipBreak': new RemoteSkipBreakUseCase(
        objects['pomodoro'],
        objects['breakTimer']
      ),
      'timer.finishPomodoro': new FinishPomodoroUseCase(
        soundService,
        systemNotificationService,
        objects['breakTimer']
      ),
      'timer.finishBreak': new FinishBreakUseCase(
        soundService,
        systemNotificationService,
        objects['pomodoro']
      ),
      'timer.fastForward': new FastForwardUseCase(
        objects['pomodoro'],
        objects['breakTimer']
      ),
      'user.getUser': new GetUserUseCase(realTimeProvider, objects['user']),
      'user.loginGoogle': new LoginGoogleUseCase(pomoguruApi),
      'user.authorizeSlack': new AuthorizeSlackUseCase(pomoguruApi)
    }
  }
}
