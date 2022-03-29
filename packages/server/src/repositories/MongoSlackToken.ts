import mongoose from 'mongoose'
import { ApplicationError } from '@server/types/errors'
const { Schema } = mongoose

import { SlackToken } from '@server/entities/slackToken'
import {
  GetOptions,
  ISlackTokenRepository
} from '@server/interfaces/slackToken'

const SlackTokenSchema = new Schema({
  userId: String,
  token: String,
  createdAt: Date
})

export class MongoSlackTokenRepo implements ISlackTokenRepository {
  private model: mongoose.Model<typeof SlackTokenSchema>

  constructor (connection: mongoose.Connection) {
    this.model = connection.model('SlackToken', SlackTokenSchema)
  }

  async save (slackToken: SlackToken) {
    const newSlackToken = new this.model(slackToken.toJSON())
    await newSlackToken.save()
  }

  async get (options?: GetOptions): Promise<SlackToken | undefined> {
    const document = await this.model
      .findOne<SlackToken>({ userId: options.userId })
      .exec()

    if (document) {
      return new SlackToken(document)
    } else {
      throw new ApplicationError(`SlackToken userId=${options.userId}`)
    }
  }

  async update (slackToken: SlackToken) {
    //@TODO: implement
  }

  async delete (slackToken: SlackToken) {
    //@TODO: implement
  }
}
