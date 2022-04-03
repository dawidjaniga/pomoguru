import Container from 'typedi'
import { UseCase } from '../interfaces/UseCase'
import { UserId } from '@server/types'
import { ApplicationError } from '../types/errors'
import { ISlackTokenRepository } from '@server/interfaces/slackToken'
import { SlackToken } from '@server/entities/slackToken'
import { Slack } from '@server/app/services/Slack'

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

    const userToken = await Slack.authorize(code)
    await slackTokenRepo.save(new SlackToken({ userId, token: userToken }))
  }
}
