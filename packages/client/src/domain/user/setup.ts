import Container, { Token } from 'typedi'
import { useCaseProviderToken } from '@pomoguru/client'
import { User } from './entities/user'

export const userToken = new Token<User>()

export class UserDomain {
  constructor () {
    Container.set(userToken, new User())

    // this.attachEvents()
  }

  attachEvents () {
    // const provider = Container.get(useCaseProviderToken)
  }
}
