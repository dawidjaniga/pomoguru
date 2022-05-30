import { UseCase } from '../../../interfaces/UseCase'

export type AuthorizeSlackInput = string
export type AuthorizeSlackOutput = void

export class AuthorizeSlackUseCase
  implements UseCase<AuthorizeSlackInput, AuthorizeSlackOutput> {
  async execute (code: string) {
    /*
    @TODO: #improvement
    Extract to API Service
    */
    const apiUrl = process.env['NX_POMOGURU_API_URL']

    await fetch(apiUrl + '/slack/authorize', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code
      })
    })
  }
}
