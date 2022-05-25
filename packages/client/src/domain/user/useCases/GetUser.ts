import Container from 'typedi'
import { UseCase } from '../../../interfaces/UseCase'

import { Publisher } from '../../../objects/publisher'
import { User } from '../entities/user'
import { realTimeProviderToken } from '@pomoguru/client'
import { userToken } from '../setup'

export type GetUserInput = void

export type GetUserOutput =
  | {
      authenticated: boolean
    }
  | {
      authenticated: boolean
      id: string
      email: string
      avatarUrl: string
    }

export class GetUserUseCase extends Publisher
  implements UseCase<GetUserInput, GetUserOutput> {
  public isReactive = true
  private user: User

  constructor () {
    super()

    this.user = Container.get(userToken)

    this.attachEvents()
  }

  async attachEvents () {
    const realTimeProvider = Container.get(realTimeProviderToken)

    realTimeProvider.subscribe('user:authorized', user => {
      console.log('get user use case', user)
      this.user.id = user.id
      this.user.email = user.email
      this.user.avatarUrl = user.avatarUrl
      this.publish('updated')
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
        authenticated: false
      }
    }
  }
}
