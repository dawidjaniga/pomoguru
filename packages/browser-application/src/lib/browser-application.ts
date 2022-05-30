import { PomoguruClient, GetTimerOutput, GetUserOutput } from '@pomoguru/client'
import { BrowserNotificationService } from './../services/BrowserNotification'
import { BrowserSoundService } from '../services/BrowserSoundService'
import { GoogleLogin } from './../services/GoogleLogin'

// @TODO: Common Interface
export class BrowserApplication {
  private client: PomoguruClient

  constructor () {
    this.client = new PomoguruClient(
      new BrowserSoundService(),
      new BrowserNotificationService()
    )
    console.log('Browser Application created')
  }

  startPomodoro () {
    this.client.startPomodoro()
  }

  pausePomodoro () {
    this.client.pausePomodoro()
  }

  skipPomodoro () {
    this.client.skipPomodoro()
  }

  skipBreak () {
    this.client.skipBreak()
  }

  subscribeToGetTimers (cb: (timers: GetTimerOutput) => void) {
    this.client.subscribeToGetTimers(cb)
  }

  subscribeToGetUser (cb: (user: GetUserOutput) => void) {
    this.client.subscribeToGetUser(cb)
  }

  renderGoogleLoginButton (selector: string) {
    GoogleLogin.renderLoginButton(selector, (token: string) =>
      this.client.loginGoogle(token)
    )
  }
}
