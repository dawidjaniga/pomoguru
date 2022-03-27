import * as jwt from 'jsonwebtoken'
import { UserId } from '@server/types'

export class AuthService {
  constructor (private privateKey: string) {}

  createJwtToken (userId: UserId) {
    const jwtToken = jwt.sign(
      {
        userId
      },
      this.privateKey,
      {
        algorithm: 'RS256'
      }
    )

    return jwtToken
  }

  verifyJwt (jwtToken: string) {
    return jwt.verify(jwtToken, this.privateKey, {
      algorithms: ['RS256']
    })
  }
}
