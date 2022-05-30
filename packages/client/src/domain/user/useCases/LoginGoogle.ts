import { UseCase } from '../../../interfaces/UseCase'
import { PomoguruApi } from '../../../services/pomoguruApi'

export type LoginGoogleInput = string
export type LoginGoogleOutput = void

export class LoginGoogleUseCase
  implements UseCase<LoginGoogleInput, LoginGoogleOutput> {
  constructor (private pomoguruApi: PomoguruApi) {}

  async execute (jwtToken: string) {
    this.pomoguruApi.loginGoogle(jwtToken)
  }
}
