import { Work } from '@server/entities/work'
import { IWorkRepository } from '@server/interfaces/work'
import Container from 'typedi'
import { UseCase } from '@server/interfaces/UseCase'
import { UserId } from '@server/types'
import { ApplicationError } from '@server/types/errors'

export type StartWorkInput = {
  userId: UserId
}

export type StartWorkOutput = void

export class StartWorkUseCase
  implements UseCase<StartWorkInput, StartWorkOutput> {
  async execute (input: StartWorkInput): Promise<void> {
    const workRepo = Container.get<IWorkRepository>('workRepo')
    const { userId } = input

    if (!userId) {
      throw new ApplicationError('UserId is not specified')
    }

    const work = new Work({ userId })

    work.start()
    await workRepo.save(work)
  }
}
