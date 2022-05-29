import Timer from '../../../valueObjects/timer'
import { UseCase } from '../../../interfaces/UseCase'

import { SoundService } from '../../../interfaces/SoundService'
import { SystemNotificationService } from '../../..//interfaces/SystemNotificationService'

export class FinishPomodoroUseCase implements UseCase {
  constructor (
    private soundService: SoundService,
    private systemNotificationService: SystemNotificationService,
    private breakTimer: Timer
  ) {}

  async execute () {
    this.soundService.playWorkEndSound()
    this.systemNotificationService.showNotification('Break Time')

    this.breakTimer.start()
  }
}
