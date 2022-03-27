import { Work } from '@server/entities/work'
import { UserId } from '@server/types'

export type WorkId = string & {
  __brand: 'workId'
}

export type WorkStatus = 'active' | 'finished' | 'paused'

export type WorkDTO = {
  id: string
  userId: string
  startDate: string
  elapsedTime: number
  status: WorkStatus
}

export type GetOptions = {
  id?: WorkId
  userId?: UserId
}

export interface IWorkRepository {
  get(options: GetOptions): Promise<Work | undefined>
  save(work: Work): Promise<void>
  update(work: Work): Promise<void>
  delete(work: Work): Promise<void>
}
