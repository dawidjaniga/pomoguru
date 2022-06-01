import { Publisher } from '../objects/publisher'
import { IllegalArgument } from './../exceptions/illegalArgument'

const oneSecondInMs = 1000
const oneMinuteInS = 60

export default class Timer extends Publisher {
  private _durationInS = 0
  private _elapsedInS = 0
  private _intervalInMs = oneSecondInMs
  private _handler: NodeJS.Timer | null = null

  constructor () {
    super()
  }

  get duration () {
    return this._durationInS
  }

  set duration (durationInS: number) {
    const minimalDuration = oneMinuteInS
    const maxiumDuration = oneMinuteInS * 120

    // if (durationInS < minimalDuration) {
    //   throw new IllegalArgument(
    //     `Duration has to be longer than ${minimalDuration} seconds`
    //   )
    // }

    if (durationInS > maxiumDuration) {
      throw new IllegalArgument(
        `Duration has to be shorter than ${maxiumDuration} seconds`
      )
    }

    this._durationInS = durationInS
  }

  get elapsed () {
    return this._elapsedInS
  }

  set elapsed (seconds: number) {
    this._elapsedInS = seconds
  }

  get timeLeft (): number {
    return this.duration - this.elapsed
  }
  get timeLeftMs (): number {
    return (this.duration - this.elapsed) * oneSecondInMs
  }

  get progress (): number {
    return this.elapsed / this.duration
  }

  get active (): boolean {
    return Boolean(this._handler)
  }

  private clearInteval () {
    if (this._handler) {
      clearInterval(this._handler)
      this._handler = null
    }
  }

  start () {
    if (!this._handler) {
      this._handler = setInterval(() => this.tick(), this._intervalInMs)
    }

    this.publish('updated')
  }

  pause () {
    this.clearInteval()
    this.publish('updated')
  }

  stop () {
    this.clearInteval()
    this._elapsedInS = 0
    this.publish('updated')
  }

  tick () {
    if (this._elapsedInS === this._durationInS) {
      this.publish('finished')
      this.stop()
    } else {
      this._elapsedInS += this._intervalInMs / oneSecondInMs
      this.publish('updated')
    }
  }
}
