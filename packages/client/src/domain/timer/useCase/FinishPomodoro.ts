import { breakTimerToken } from './../setup'
import Container, { Service } from 'typedi'
import { UseCase } from '../../../interfaces/UseCase'

import {
  soundServiceToken,
  systemNotificationServiceToken
} from '@pomoguru/client'

@Service()
export class FinishPomodoroUseCase implements UseCase {
  async execute () {
    const soundService = Container.get(soundServiceToken)
    const notificationService = Container.get(systemNotificationServiceToken)
    const breakTimer = Container.get(breakTimerToken)

    soundService.playWorkEndSound()
    notificationService.showNotification('Break Time')

    breakTimer.start()
  }
}
