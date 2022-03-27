export interface Observer {
  update(subject: Subject): void
}

export class Subject {
  private _observers: Observer[] = []

  attach (observer: Observer): void {
    this._observers.push(observer)
  }

  detach (observer: Observer): void {
    this._observers = this._observers.filter(item => item !== observer)
  }

  notify () {
    this._observers.forEach(observer => observer.update(this))
  }
}
