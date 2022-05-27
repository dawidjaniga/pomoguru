import { UseCase } from '../../../interfaces/UseCase'

export type LoginGoogleInput = string
export type LoginGoogleOutput = void

export class LoginGoogleUseCase
  implements UseCase<LoginGoogleInput, LoginGoogleOutput> {
  /*
    @TODO: #improvement
    Require passing jwtToken - other useCases types break after the change
    */
  async execute (jwtToken?: string) {
    /*
    @TODO: #improvement
    Extract to API Service
    */
    const apiUrl = process.env['NX_POMOGURU_API_URL']

    await fetch(apiUrl + '/login/google', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwtToken
      })
    })
  }
}
