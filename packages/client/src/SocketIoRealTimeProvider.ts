import { io, Socket } from 'socket.io-client'
import { Publisher } from './objects/publisher'
import debugModule from 'debug'

const debug = debugModule('pomoguru:client:socket.io')
const apiUrl = process.env['NX_POMOGURU_API_URL']

if (!apiUrl) {
  throw new Error('NX_POMOGURU_API_URL is not defined')
}
export class SocketIoRealTimeProvider extends Publisher {
  private mainSocket: Socket
  private userSocket: Socket | null = null

  constructor () {
    super()

    if (!apiUrl) {
      throw new Error('NX_POMOGURU_API_URL is not defined')
    }

    this.mainSocket = io(apiUrl, {
      withCredentials: true
    })

    this.mainSocket.onAny((event, ...args) => {
      debug('received event on main socket', event, args)
    })

    this.attachEvents()
  }

  attachEvents () {
    this.mainSocket.on('connect', () => {
      debug('socket connected', this.mainSocket)
    })

    this.mainSocket.on('user:authorized', user => {
      if (!apiUrl) {
        throw new Error('NX_POMOGURU_API_URL is not defined')
      }

      this.userSocket = io(apiUrl + `/users`, {
        withCredentials: true
      })

      this.userSocket.onAny((event, ...args) => {
        debug('received event on user socket', event, args)
      })

      this.userSocket.on('connect', () => {
        debug('user connected', this.userSocket)
      })

      this.userSocket.on('pomodoroStarted', (occuredAt: number) => {
        debug('pomodoroStarted')
        this.publish('pomodoroStarted', occuredAt)
      })

      this.userSocket.on('pomodoroPaused', () => {
        debug('pomodoroPaused')
        this.publish('pomodoroPaused')
      })
      this.userSocket.on('breakSkipped', () => {
        this.publish('breakSkipped')
      })
      this.userSocket.on('workCanceled', () => {
        this.publish('workCanceled')
      })

      this.publish('user:authorized', user)
    })

    this.mainSocket.on('disconnect', () => {
      debug('socket disconncted', this.mainSocket.id)
    })
  }

  startPomodoro () {
    this.userSocket?.emit('startPomodoro', Date.now())
  }

  pausePomodoro () {
    this.userSocket?.emit('pausePomodoro', Date.now())
  }

  skipPomodoro () {
    this.userSocket?.emit('skipPomodoro', Date.now())
  }

  skipBreak () {
    this.userSocket?.emit('skipBreak', Date.now())
  }
}
