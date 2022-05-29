type Subscriber = (data?: any) => void
import debugModule from 'debug'

const debug = debugModule('pomoguru:client:publisher')

// @TODO: Extract
const isDevelopment = true

type Unsubscriber = () => void
export class Publisher {
  private _subscribers: Record<string, Subscriber[]> = {}

  subscribe (event: string, subscriber: Subscriber): Unsubscriber {
    if (!this._subscribers[event]) {
      this._subscribers[event] = []
    }

    this._subscribers[event].push(subscriber)

    return () => this.unsubscribe(event, subscriber)
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
    } else if (isDevelopment) {
      debug(`published event "${event}" has no subscribers`)
    }
  }
}
