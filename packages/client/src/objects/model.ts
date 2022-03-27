import { Publisher } from './subscriber'
import format from 'date-fns/format'

export type Phase = 'idle' | 'work' | 'paused' | 'break'

export class Model extends Publisher {
  private _data = {}

  constructor () {
    super()
  }

  setData (data: any) {
    this._data = data || {}
  }

  set (name: string, value: any) {
    this._data[name] = value
    this.publish(`${name}:changed`, value)
  }

  get (name: string) {
    return this._data[name]
  }

  setTimeLeft (elapsedSeconds: number) {
    const phase = this.get('phase')
    const workDuration = this.get('workDuration')
    const breakDuration = this.get('breakDuration')

    let secondsLeft = 0
    let percentCompleted = 0

    switch (phase) {
      case 'idle':
      case 'work':
      case 'paused':
        secondsLeft = workDuration - elapsedSeconds
        percentCompleted = elapsedSeconds / workDuration
        break
      case 'break':
        secondsLeft = breakDuration - elapsedSeconds
        percentCompleted = elapsedSeconds / breakDuration
        break
    }

    this.set('timeLeft', {
      phase,
      formattedSeconds: format(new Date(secondsLeft * 1000), 'mm:ss'),
      secondsLeft,
      percentCompleted
    })
  }
}
