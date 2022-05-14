import Interval from './interval'

describe('Interval', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should start and stop interval', () => {
    // given
    const interval = new Interval()
    const subscriber = jest.fn()

    // when
    interval.subscribe('intervalTicked', subscriber)
    interval.start()

    jest.advanceTimersByTime(interval.durationMs)

    // then
    expect(subscriber).toBeCalledTimes(1)

    // when
    jest.advanceTimersByTime(interval.durationMs)
    jest.advanceTimersByTime(interval.durationMs)

    //then
    expect(subscriber).toBeCalledTimes(3)

    // when
    interval.stop()
    jest.advanceTimersByTime(interval.durationMs)
    jest.advanceTimersByTime(interval.durationMs)

    // then
    expect(subscriber).toBeCalledTimes(3)
  })
})
