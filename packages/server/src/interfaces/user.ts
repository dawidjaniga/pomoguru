import { UserId } from '@server/types'
import { User } from '@server/entities/user'

export type UserDTO = {
  id: string
  email: string
  avatarUrl: string
  createdAt: string
}

export type GetOptions = {
  id?: UserId
  email?: string
}

export interface IUserRepository {
  get(options: GetOptions): Promise<User | undefined>
  save(user: User): Promise<void>
  update(user: User): Promise<void>
  delete(user: User): Promise<void>
}
