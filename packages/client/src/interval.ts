import { Publisher } from './objects/publisher'

export default class Interval extends Publisher {
  public durationMs = 1000
  private handler: number | null = null

  constructor () {
    super()
  }

  start () {
    if (!this.handler) {
      // @ts-ignore
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
