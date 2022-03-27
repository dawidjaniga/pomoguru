import { io, Socket } from 'socket.io-client'

export class SocketIoRealTimeProvider {
  private socket: Socket
  // private userChannel: Channel

  constructor () {
    this.socket = io('http://localhost:4000')

    this.attachEvents()
  }

  attachEvents () {
    this.socket.on('connect', () => {
      console.log('socket connected', this.socket.id) // x8WIv7-mJelg7on_ALbx
    })

    this.socket.on('disconnect', () => {
      console.log('socket disconncted', this.socket.id) // undefined
    })
  }

  subscribeToUserChannel (channelName: string) {
    // this.userChannel = this.client.subscribe(
    //   'private-user-5ZFoq2blOss5el_gmH9iX'
    // )
    // this.userChannel = this.client.subscribe(channelName)
    // this.userChannel = this.client.subscribe('private-' + channelName)
  }

  onUserChannelEvent (event: string, listener: () => void) {
    // this.userChannel.bind(event, listener)
  }

  userStartWork () {
    this.socket.emit('main-channel', {})
  }

  userPauseWork () {
    // this.userChannel.trigger('client-pause-work', {})
  }
  userSkipBreak () {
    // this.userChannel.trigger('client-skip-break', {})
  }
  userCancelWork () {
    // this.userChannel.trigger('client-cancel-work', {})
  }
}
