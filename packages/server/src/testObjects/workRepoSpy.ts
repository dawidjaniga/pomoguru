import { Work } from '../entities/work'
import { GetOptions, IWorkRepository } from '@server/interfaces/work'

export class WorkRepoSpy implements IWorkRepository {
  private work: Work[]
  private timesSaveCalled: number

  constructor (work?: Work[]) {
    this.work = work || []
    this.timesSaveCalled = 0
  }

  async get (options: GetOptions): Promise<Work | undefined> {
    return this.work.find(
      work => work.id === options.id || work.userId === options.userId
    )
  }

  async save (work: Work): Promise<void> {
    this.work.push(work)
    this.timesSaveCalled++
  }

  async update (work: Work): Promise<void> {
    await this.delete(work)
    await this.save(work)
  }

  async delete (work: Work): Promise<void> {
    this.work = this.work.filter(item => item.id === work.id)
  }

  getTimesSaveCalled (): number {
    return this.timesSaveCalled
  }
}
