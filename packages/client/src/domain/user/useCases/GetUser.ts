import { SocketIoRealTimeProvider } from './../../../SocketIoRealTimeProvider'

import { UseCase } from '../../../interfaces/UseCase'

import { Publisher } from '../../../objects/publisher'
import { User } from '../entities/user'

export type GetUserInput = void
export type GetUserOutput = {
  authenticated: boolean
  id?: string
  email?: string
  avatarUrl?: string
}

export class GetUserUseCase implements UseCase<GetUserInput, GetUserOutput> {
  private publisher: Publisher = new Publisher()

  constructor (
    private realTimeProvider: SocketIoRealTimeProvider,
    private user: User
  ) {
    this.attachEvents()
  }

  async subscribe (event: string, subscriber: (data: GetUserOutput) => void) {
    this.publisher.subscribe(event, subscriber)
    subscriber(await this.execute())
  }

  async attachEvents () {
    this.realTimeProvider.subscribe('user:authorized', async user => {
      this.user.id = user.id
      this.user.email = user.email
      this.user.avatarUrl = user.avatarUrl

      this.publisher.publish('updated', await this.execute())
    })
  }

  async execute () {
    if (this.user.id) {
      return {
        authenticated: true,
        id: this.user.id,
        email: this.user.email,
        avatarUrl: this.user.avatarUrl
      }
    } else {
      return {
        authenticated: false,
        id: '',
        email: '',
        avatarUrl: ''
      }
    }
  }
}
