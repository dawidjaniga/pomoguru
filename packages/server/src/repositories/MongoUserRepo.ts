import * as mongoose from 'mongoose'
import { ApplicationError } from '@server/types/errors'
const { Schema } = mongoose

import { User } from '../entities/user'
import { GetOptions, IUserRepository } from '../interfaces/user'

const UserSchema = new Schema({
  id: String,
  email: String,
  avatarUrl: String,
  createdAt: Date
})

export class MongoUserRepo implements IUserRepository {
  private model: mongoose.Model<typeof UserSchema>

  constructor (connection: mongoose.Connection) {
    this.model = connection.model('User', UserSchema)
  }

  async save (user: User) {
    const newUser = new this.model(user.toJSON())
    await newUser.save()
  }

  async get (options?: GetOptions): Promise<User | undefined> {
    const document = await this.model
      .findOne<User>({ $or: [{ id: options?.id }, { email: options?.email }] })
      .exec()

    if (document) {
      return new User(document)
    } else {
      throw new ApplicationError(
        `User id=${options?.id} OR email=${options?.email}`
      )
    }
  }

  async update (user: User) {}

  async delete (user: User) {}
}
