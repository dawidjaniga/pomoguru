import { ISlackTokenRepository } from './../interfaces/slackToken'
import { Work } from '@server/entities/work'
import { IWorkRepository } from '@server/interfaces/work'
import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'
import { UserId } from '@server/types'
import { ApplicationError } from '@server/types/errors'
import { Slack } from '@server/app/services/Slack'
import addMinutes from 'date-fns/addMinutes'

export type StartWorkInput = {
  userId: UserId
}

export type StartWorkOutput = void

export class StartWorkUseCase
  implements UseCase<StartWorkInput, StartWorkOutput> {
  async execute (input: StartWorkInput): Promise<void> {
    const workRepo = Container.get<IWorkRepository>('workRepo')
    const slackTokenRepo = Container.get<ISlackTokenRepository>(
      'slackTokenRepo'
    )
    const { userId } = input
    const focusPhaseDurationInMinutes = 25
    const pomodoroEndTime = addMinutes(new Date(), focusPhaseDurationInMinutes)

    if (!userId) {
      throw new ApplicationError('UserId is not specified')
    }

    const work = new Work({ userId })

    work.start()
    await workRepo.save(work)

    const userToken = await slackTokenRepo.get({ userId })
    await Slack.changeStatus(
      {
        text: 'Focusing',
        emoji: ':zap:',
        expireTime: pomodoroEndTime
      },
      userToken.token
    )
  }
}
