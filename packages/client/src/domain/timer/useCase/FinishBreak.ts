import { pomodoroToken } from './../setup'
import Container, { Service } from 'typedi'
import { UseCase } from '../../../interfaces/UseCase'

import {
  soundServiceToken,
  systemNotificationServiceToken
} from '@pomoguru/client'

@Service()
export class FinishBreakUseCase implements UseCase {
  async execute () {
    const soundService = Container.get(soundServiceToken)
    const notificationService = Container.get(systemNotificationServiceToken)
    const pomodoro = Container.get(pomodoroToken)

    soundService.playBreakEndSound()
    // @TODO: Maybe add Translation service?
    notificationService.showNotification('Focus time')

    pomodoro.start()
  }
}
