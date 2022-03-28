import { GoogleAuthService } from './../app/services/GoogleAuth'
import { NotFoundError } from '../types/errors'

import Container from 'typedi'
import { UseCase } from '../interfaces/UseCase'

import { ApplicationError } from '../types/errors'
import { IUserRepository } from '../interfaces/user'
import { AuthService } from '../app/services/Auth'
import { User } from '../entities/user'

export type LoginFederatedUserInput = {
  jwtToken: string
  provider: 'google'
}

export type LoginFederatedUserOutput = string | undefined

export class LoginFederatedUserUseCase
  implements UseCase<LoginFederatedUserInput, LoginFederatedUserOutput> {
  async execute (input: LoginFederatedUserInput) {
    const userRepo = Container.get<IUserRepository>('userRepo')
    const authService = Container.get<AuthService>('authService')
    const { jwtToken, provider } = input

    if (!jwtToken) {
      throw new ApplicationError('JWT Token is not specified')
    }

    if (!provider) {
      throw new ApplicationError('Provider is not specified')
    }

    if (provider === 'google') {
      const googleAuthService = Container.get<GoogleAuthService>(
        'googleAuthService'
      )

      try {
        const payload = await googleAuthService.verify(jwtToken)

        if (payload?.email) {
          try {
            const user = await userRepo.get({ email: payload.email })
            return authService.createJwtToken(user.id)
          } catch (_) {
            const newUser = new User({
              email: payload.email,
              avatarUrl: payload.picture
            })

            const authToken = authService.createJwtToken(newUser.id)
            await userRepo.save(newUser)
            return authToken
          }
        }
      } catch (e) {
        console.error(e)
        throw new ApplicationError('Google Token verification error')
      }
    }
  }
}
