import { SlackToken } from '@server/entities/slackToken'
import {
  GetOptions,
  ISlackTokenRepository
} from '@server/interfaces/slackToken'

export class SlackTokenRepoSpy implements ISlackTokenRepository {
  private tokens: SlackToken[]
  private timesSaveCalled: number

  constructor (tokens?: SlackToken[]) {
    this.tokens = tokens || []
    this.timesSaveCalled = 0
  }

  async get (options: GetOptions): Promise<SlackToken | undefined> {
    return this.tokens.find(token => token.userId === options.userId)
  }

  async save (token: SlackToken): Promise<void> {
    this.tokens.push(token)
    this.timesSaveCalled++
  }

  async update (token: SlackToken): Promise<void> {
    await this.delete(token)
    await this.save(token)
  }

  async delete (token: SlackToken): Promise<void> {
    this.tokens = this.tokens.filter(item => item.userId === token.userId)
  }

  getTimesSaveCalled (): number {
    return this.timesSaveCalled
  }
}
