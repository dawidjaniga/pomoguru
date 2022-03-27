import { OAuth2Client } from 'google-auth-library'

export class GoogleAuthService {
  private client: OAuth2Client

  constructor (private clientId: string) {
    this.client = new OAuth2Client(clientId)
  }

  async verify (jwtToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: jwtToken,
      audience: this.clientId
    })
    const payload = ticket.getPayload()

    return payload
  }
}
