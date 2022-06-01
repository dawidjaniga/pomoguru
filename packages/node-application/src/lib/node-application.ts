import { PomoguruClient, GetTimerOutput } from '@pomoguru/client'
import { NodeSoundService } from '../services/SoundService'
import { NodeNotificationService } from '../services/SystemNotification'

export class NodeApplication {
  private client: PomoguruClient

  constructor () {
    this.client = new PomoguruClient(
      new NodeSoundService(),
      new NodeNotificationService()
    )
  }

  startPomodoro () {
    this.client.startPomodoro()
  }

  subscribeToGetTimers (cb: (timers: GetTimerOutput) => void) {
    this.client.subscribeToGetTimers(cb)
  }
}
