import Container from 'typedi'
import Pomodoro from '../../valueObjects/timer'

export class TimerDomain {
  constructor () {
    const pomodoro = new Pomodoro()
    Container.set('pomodoro', pomodoro)
  }
}
