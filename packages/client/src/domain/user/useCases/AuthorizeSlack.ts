import { UseCase } from '../../../interfaces/UseCase'
import { PomoguruApi } from '../../../services/pomoguruApi'

export type AuthorizeSlackInput = string
export type AuthorizeSlackOutput = void

export class AuthorizeSlackUseCase
  implements UseCase<AuthorizeSlackInput, AuthorizeSlackOutput> {
  constructor (private pomoguruApi: PomoguruApi) {}

  async execute (code: string) {
    this.pomoguruApi.authorizeSlack(code)
  }
}
