import Container, { Token } from 'typedi'

import { User } from './entities/user'

export const userToken = new Token<User>()

export class UserDomain {
  constructor () {
    Container.set(userToken, new User())
  }
}
