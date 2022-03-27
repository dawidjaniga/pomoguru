import { Publisher } from './objects/subscriber'

export default class Timer extends Publisher {
  public secondsDuration = 0
  private _elapsedSeconds = 0

  constructor () {
    super()
  }

  get elapsedSeconds () {
    return this._elapsedSeconds
  }

  reset () {
    this._elapsedSeconds = 0
  }

  tick (): void {
    if (this._elapsedSeconds === this.secondsDuration) {
      this.publish('timerFinished')
    } else {
      this._elapsedSeconds++
    }
  }
}
