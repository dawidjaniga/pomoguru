import Timer from '../valueObjects/timer'

import { SoundService } from '../interfaces/SoundService'
import { SystemNotificationService } from '../interfaces/SystemNotificationService'
import { GetUserUseCase } from '../domain/user/useCases/GetUser'
import { SkipPomodoroUseCase } from '../domain/timer/useCase/SkipPomodoro'
import { PausePomodoroUseCase } from '../domain/timer/useCase/PausePomodoro'
import { FinishBreakUseCase } from '../domain/timer/useCase/FinishBreak'
import { FinishPomodoroUseCase } from '../domain/timer/useCase/FinishPomodoro'
import { StartPomodoroUseCase } from '../domain/timer/useCase/StartPomodoro'
import {
  GetTimerOutput,
  GetTimersUseCase
} from '../domain/timer/useCase/GetTimers'
import { SkipBreakUseCase } from '../domain/timer/useCase/SkipBreak'
import { LoginGoogleUseCase } from '../domain/user/useCases/LoginGoogle'
import { SocketIoRealTimeProvider } from '../SocketIoRealTimeProvider'
import { User } from '../domain/user/entities/user'

// @TODO: Extract to Settings Object
const pomodoroDuration = 25 * 60
const breakDuration = 5 * 60

export class PomoguruClient {
  private useCases: Record<string, any> = {}
  private objects: Record<string, any> = {}
  private realTimeProvider: SocketIoRealTimeProvider

  constructor (
    private soundService: SoundService,
    private systemNotificationService: SystemNotificationService
  ) {
    this.realTimeProvider = new SocketIoRealTimeProvider()

    this.createObjects()
    this.createUseCases()
    this.attachEvents()
  }

  private createUseCases () {
    this.useCases = {
      'timer.getTimers': new GetTimersUseCase(
        this.objects['pomodoro'],
        this.objects['breakTimer']
      ),
      'timer.startPomodoro': new StartPomodoroUseCase(this.objects['pomodoro']),
      'timer.pausePomodoro': new PausePomodoroUseCase(this.objects['pomodoro']),
      'timer.skipPomodoro': new SkipPomodoroUseCase(this.objects['pomodoro']),
      'timer.skipBreak': new SkipBreakUseCase(
        this.objects['pomodoro'],
        this.objects['breakTimer']
      ),
      'timer.finishPomodoro': new FinishPomodoroUseCase(
        this.soundService,
        this.systemNotificationService,
        this.objects['pomodoro']
      ),
      'timer.finishBreak': new FinishBreakUseCase(
        this.soundService,
        this.systemNotificationService,
        this.objects['breakTimer']
      ),
      'user.getUser': new GetUserUseCase(
        this.realTimeProvider,
        this.objects['user']
      ),
      'user.loginGoogle': new LoginGoogleUseCase()
    }
  }

  createObjects () {
    this.objects['pomodoro'] = new Timer()
    this.objects['pomodoro'].duration = pomodoroDuration

    this.objects['breakTimer'] = new Timer()
    this.objects['breakTimer'].duration = breakDuration

    this.objects['user'] = new User()
  }

  attachEvents () {
    this.objects['pomodoro'].subscribe('finished', async () => {
      this.useCases['timer.finishPomodoro'].execute()
    })

    this.objects['breakTimer'].subscribe('finished', async () => {
      this.useCases['timer.finishBreak'].execute()
    })
  }

  startPomodoro () {
    this.useCases['timer.startPomodoro'].execute()
    // this.soundService.playBreakEndSound()
  }

  subscribeToGetTimers (cb: (timers: GetTimerOutput) => void) {
    this.useCases['timer.getTimers'].subscribe('updated', cb)
  }
}
