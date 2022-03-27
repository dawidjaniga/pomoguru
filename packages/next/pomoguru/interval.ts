import { Publisher } from './objects/subscriber'

export default class Interval extends Publisher {
  public durationMs: number = 1000
  private handler: NodeJS.Timer = null

  constructor () {
    super()
  }

  start () {
    if (!this.handler) {
      this.handler = setInterval(
        () => this.publish('intervalTicked'),
        this.durationMs
      )
    }
  }

  stop () {
    if (this.handler) {
      clearInterval(this.handler)
      this.handler = null
    }
  }
}
