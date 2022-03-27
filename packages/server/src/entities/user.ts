import { nanoid } from 'nanoid'
import { UserId } from '@server/types'
import { UserDTO } from '@server/interfaces/user'

export type UserConstructor = {
  id?: UserId
  email: string
  avatarUrl?: string
  createdAt?: string
}

export class User {
  private _id: UserId
  private _email: string
  private _avatarUrl: string
  private _createdAt: Date

  constructor (options: UserConstructor) {
    this._id = options.id ?? (nanoid() as UserId)
    this._email = options.email
    this._avatarUrl = options.avatarUrl || ''
    this._createdAt = options.createdAt
      ? new Date(options.createdAt)
      : new Date()
  }

  get id (): UserId {
    return this._id
  }

  get email (): string {
    return this._email
  }

  toJSON (): UserDTO {
    return {
      id: String(this._id),
      email: this._email,
      avatarUrl: this._avatarUrl,
      createdAt: this._createdAt.toJSON()
    }
  }
}
