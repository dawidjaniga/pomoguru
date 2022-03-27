type Subscriber = (data?: any) => void
export class Publisher {
  private _subscribers: Record<string, Subscriber[]> = {}

  subscribe (event: string, subscriber: Subscriber): void {
    if (!this._subscribers[event]) {
      this._subscribers[event] = []
    }

    this._subscribers[event].push(subscriber)
  }

  unsubscribe (event: string, subscriber: Subscriber): void {
    if (this._subscribers[event]) {
      this._subscribers[event] = this._subscribers[event].filter(
        item => item !== subscriber
      )
    }
  }

  publish (event: string, data?: any) {
    if (this._subscribers[event]) {
      this._subscribers[event].forEach(subscriber => subscriber(data))
    }
  }
}
