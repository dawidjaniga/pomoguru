import jwt from 'jsonwebtoken'
import { UserId } from '@server/types'

export type JwtToken = {
  userId: string
}
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

  verifyJwt (jwtToken: string): JwtToken | null {
    // @TODO: Can it be typed better?

    return jwt.verify(jwtToken, this.privateKey, {
      algorithms: ['RS256']
    }) as JwtToken
  }
}
