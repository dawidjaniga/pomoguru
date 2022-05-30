import axios, { Axios } from 'axios'

export class PomoguruApi {
  private client: Axios

  constructor (private url: string) {
    this.client = axios.create({
      withCredentials: true,
      baseURL: this.url,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async loginGoogle (jwtToken: string) {
    await this.client.post('/login/google', { jwtToken })
  }

  async authorizeSlack (code: string) {
    await this.client.post('/slack/authorize', { code })
  }
}
