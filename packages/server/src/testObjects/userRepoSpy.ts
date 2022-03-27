import { User } from '@server/entities/user'
import { GetOptions, IUserRepository } from '@server/interfaces/user'

export class UserRepoSpy implements IUserRepository {
  private users: User[]
  private timesSaveCalled: number

  constructor (users?: User[]) {
    this.users = users || []
    this.timesSaveCalled = 0
  }

  async get (options: GetOptions): Promise<User | undefined> {
    return this.users.find(
      user => user.id === options.id || user.email === options.email
    )
  }

  async save (user: User): Promise<void> {
    this.users.push(user)
    this.timesSaveCalled++
  }

  async update (user: User): Promise<void> {
    await this.delete(user)
    await this.save(user)
  }

  async delete (user: User): Promise<void> {
    this.users = this.users.filter(item => item.id === user.id)
  }

  getTimesSaveCalled (): number {
    return this.timesSaveCalled
  }
}
