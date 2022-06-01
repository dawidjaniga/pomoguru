import { Application } from '@pomoguru/client'
import { NodeSoundService } from '../services/SoundService'
import { NodeNotificationService } from '../services/SystemNotification'

export function createNodeApplication (): Application {
  return new Application(new NodeSoundService(), new NodeNotificationService())
}
