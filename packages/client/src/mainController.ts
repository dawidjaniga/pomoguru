import { SocketIoRealTimeProvider } from './SocketIoRealTimeProvider'
import Interval from './interval'
import { Subject } from './objects/observer'
import Timer from './timer'
import { Model } from './objects/model'

// @TODO: Extract to Settings Object
const workDuration = 25 * 60
const breakDuration = 5 * 60

type UserResponse = {
  data: {
    user: {
      userId: string
      fullName: string
      avatarUrl: string
    }
  }
}

const apiUrl = process.env['NX_POMOGURU_API_URL']

export class MainController extends Subject {
  constructor (
    public interval: Interval,
    public timer: Timer,
    public model: Model,
    public realTimeProvider: SocketIoRealTimeProvider
  ) {
    super()

    this.model.set('phase', 'idle')
    this.model.set('workDuration', workDuration)
    this.model.set('breakDuration', breakDuration)
    this.model.setTimeLeft(this.timer.elapsedSeconds)

    this.interval.subscribe('intervalTicked', () => {
      this.timer.tick()
      this.model.setTimeLeft(this.timer.elapsedSeconds)
    })
    this.timer.secondsDuration = workDuration
    this.timer.subscribe('timerFinished', () => this.onTimerFinished())

    this.getUser()
  }

  async loginGoogle (jwtToken: string) {
    await fetch(apiUrl + '/login/google', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwtToken
      })
    })
  }

  async getUser () {
    try {
      const response = await fetch(apiUrl + '/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const body = (await response.json()) as UserResponse

      if (body.data) {
        const { user } = body.data

        this.model.set('user', {
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          userId: user.userId
        })
        this.realTimeProvider.subscribeToUserChannel('user-' + user.userId)
      }

      this.realTimeProvider.onUserChannelEvent('client-start-work', () => {
        if (this.model.get('phase') !== 'work') {
          this.startWork()
        }
      })

      this.realTimeProvider.onUserChannelEvent('client-pause-work', () => {
        if (this.model.get('phase') !== 'paused') {
          this.pauseWork()
        }
      })

      this.realTimeProvider.onUserChannelEvent('client-skip-break', () => {
        if (this.model.get('phase') !== 'break') {
          this.skipBreak()
        }
      })
      this.realTimeProvider.onUserChannelEvent('client-cancel-work', () => {
        if (this.model.get('phase') === 'paused') {
          this.cancelWork()
        }
      })
    } catch (e) {
      console.error('getUser error', e)
    }
  }

  async startWork () {
    this.model.set('phase', 'work')
    this.interval.start()
    this.realTimeProvider.userStartWork()
  }

  async pauseWork () {
    this.model.set('phase', 'paused')
    this.interval.stop()
    this.realTimeProvider.userPauseWork()
  }

  skipBreak () {
    this.timer.reset()
    this.model.set('phase', 'work')
    this.timer.secondsDuration = workDuration
    this.realTimeProvider.userSkipBreak()
  }

  cancelWork () {
    this.timer.reset()
    this.model.set('phase', 'idle')
    this.model.setTimeLeft(this.timer.elapsedSeconds)
    this.realTimeProvider.userCancelWork()
  }

  onTimerFinished () {
    const phase = this.model.get('phase')
    this.interval.stop()
    this.timer.reset()

    if (phase === 'work') {
      this.model.set('phase', 'break')
      this.timer.secondsDuration = breakDuration
    }

    if (phase === 'break') {
      this.model.set('phase', 'work')
      this.timer.secondsDuration = workDuration
    }

    this.interval.start()
  }
}
