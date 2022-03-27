import { NotFoundError } from '../types/errors'
import { IWorkRepository } from '../interfaces/work'
import Container from 'typedi'
import { UseCase } from '../interfaces/UseCase'
import { UserId } from '@server/types'
import { ApplicationError } from '../types/errors'

export type FinishWorkInput = {
  userId: UserId
}

export type FinishWorkOutput = void

export class FinishWorkUseCase
  implements UseCase<FinishWorkInput, FinishWorkOutput> {
  async execute (input: FinishWorkInput): Promise<void> {
    const workRepo = Container.get<IWorkRepository>('workRepo')
    const { userId } = input

    if (!userId) {
      throw new ApplicationError('UserId is not specified')
    }

    const work = await workRepo.get({ userId })

    if (work) {
      work.finish()
      await workRepo.update(work)
    } else {
      throw new NotFoundError('There is no active Work phase')
    }
  }
}
