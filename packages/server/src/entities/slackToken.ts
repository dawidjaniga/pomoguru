import { SlackTokenDTO } from '@server/interfaces/slackToken'

export type SlackTokenConstructor = {
  userId: string
  token: string
  createdAt?: string
}

export class SlackToken {
  private _userId: string
  private _token: string
  private _createdAt: Date

  constructor (options: SlackTokenConstructor) {
    this._userId = options.userId
    this._token = options.token
    this._createdAt = options.createdAt
      ? new Date(options.createdAt)
      : new Date()
  }

  get userId (): string {
    return this._userId
  }

  get token (): string {
    return this._token
  }

  toJSON (): SlackTokenDTO {
    return {
      userId: this._userId,
      token: this._token,
      createdAt: this._createdAt.toJSON()
    }
  }
}
