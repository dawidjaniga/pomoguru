import { MainController } from './mainController'
import Interval from './interval'
import Timer from './timer'
import { Model } from './objects/model'

describe('MainController', () => {
  it('should start work', () => {
    // given
    const interval = new Interval()
    interval.start = jest.fn()
    interval.stop = jest.fn()

    const timer = new Timer()
    const model = new Model()
    const mediator = new MainController(interval, timer, model)

    // when
    mediator.startWork()

    // then
    expect(interval.start).toHaveBeenCalled()

    // when
    interval.publish('intervalTicked')
    interval.publish('intervalTicked')

    // then
    expect(timer.elapsedSeconds).toEqual(2)

    mediator.pauseWork()
  })

  it('should start Break phase after Work is done', () => {
    // given
    const interval = new Interval()
    interval.start = jest.fn()
    interval.stop = jest.fn()

    const timer = new Timer()
    const model = new Model()
    // @TODO: Pass duration as settings

    const mediator = new MainController(interval, timer, model)

    // when
    mediator.startWork()
    let i = 0
    while (i <= 5) {
      interval.publish('intervalTicked')
      i++
    }

    // then
    expect(model.get('phase')).toEqual('break')

    mediator.pauseWork()
  })
})
