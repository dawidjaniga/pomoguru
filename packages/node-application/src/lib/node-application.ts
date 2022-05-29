import { PomoguruClient } from '../../../client/src/core/pomoguruClient'
import { NodeSoundService } from '../services/SoundService'
import { NodeNotificationService } from '../services/SystemNotification'
import { GetTimerOutput } from 'packages/client/src/domain/timer/useCase/GetTimers'

export class NodeApplication {
  private client: PomoguruClient

  constructor () {
    this.client = new PomoguruClient(
      new NodeSoundService(),
      new NodeNotificationService()
    )
    console.log('whkonu node works hooouuura!')
  }

  startPomodoro () {
    console.log('start pomodoro')
    this.client.startPomodoro()
  }

  subscribeToGetTimers (cb: (timers: GetTimerOutput) => void) {
    this.client.subscribeToGetTimers(cb)
  }
}
