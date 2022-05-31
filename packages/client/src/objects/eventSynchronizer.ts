export class EventSynchronizer {
  static syncToCurrentSecond (
    occuredAt: number,
    callback: (delayDurationInS: number) => void
  ) {
    const timeElapsedFromRemoteEvent = Date.now() - occuredAt
    const fullSecondsElapsedFromRemoteEvent =
      Math.ceil(timeElapsedFromRemoteEvent / 1000) * 1000
    const waitFor =
      fullSecondsElapsedFromRemoteEvent - timeElapsedFromRemoteEvent
    const delayDurationInS = fullSecondsElapsedFromRemoteEvent / 1000

    setTimeout(() => {
      callback(delayDurationInS)
    }, waitFor)
  }
}
