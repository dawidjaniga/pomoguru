import { SlackToken } from '@server/entities/slackToken'

export type SlackTokenDTO = {
  userId: string
  token: string
  createdAt: string
}

export type GetOptions = {
  userId: string
}

export interface ISlackTokenRepository {
  get(options: GetOptions): Promise<SlackToken | undefined>
  save(user: SlackToken): Promise<void>
  update(user: SlackToken): Promise<void>
  delete(user: SlackToken): Promise<void>
}
