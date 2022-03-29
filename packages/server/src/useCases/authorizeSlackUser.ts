import Container from 'typedi'
import { UseCase } from '../interfaces/UseCase'
import { UserId } from '@server/types'
import { ApplicationError } from '../types/errors'
import { ISlackTokenRepository } from '@server/interfaces/slackToken'
import slack from 'slack'
import { SlackToken } from '@server/entities/slackToken'

export type AuthorizeSlackUserInput = {
  userId: UserId
  code: string
}

export type AuthorizeSlackUserOutput = void

export class AuthorizeSlackUserUseCase
  implements UseCase<AuthorizeSlackUserInput, AuthorizeSlackUserOutput> {
  async execute (input: AuthorizeSlackUserInput): Promise<void> {
    const slackTokenRepo = Container.get<ISlackTokenRepository>(
      'slackTokenRepo'
    )
    const { userId, code } = input

    if (!userId) {
      throw new ApplicationError('UserId is not specified')
    }

    if (!code) {
      throw new ApplicationError('Code is not specified')
    }

    const response = await slack.oauth.access({
      client_id: 'client_id',
      client_secret: 'client_secret',
      code
    })

    if (response.ok && response.access_token) {
      await slackTokenRepo.save(
        new SlackToken({ userId, token: response.access_token })
      )
    } else {
      throw new ApplicationError('Slack access_token is not found')
    }
  }
}
