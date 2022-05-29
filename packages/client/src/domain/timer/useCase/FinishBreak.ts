import Timer from '../../../valueObjects/timer'
import { UseCase } from '../../../interfaces/UseCase'

import { SoundService } from '../../../interfaces/SoundService'
import { SystemNotificationService } from '../../..//interfaces/SystemNotificationService'

export class FinishBreakUseCase implements UseCase {
  constructor (
    private soundService: SoundService,
    private systemNotificationService: SystemNotificationService,
    private pomodoro: Timer
  ) {}

  async execute () {
    this.soundService.playBreakEndSound()
    // @TODO: Maybe add Translation service?
    this.systemNotificationService.showNotification('Focus time')

    this.pomodoro.start()
  }
}
