import * as mongoose from 'mongoose'
import { ApplicationError } from '@server/types/errors'
const { Schema } = mongoose

import { GetOptions, IWorkRepository } from '@server/interfaces/work'
import { Work } from '@server/entities/work'

const WorkSchema = new Schema({
  id: String,
  userId: String,
  startDate: String,
  elapsedTime: Number,
  status: String
  // status: 'active' | 'finished' | 'paused'
})

export class MongoWorkRepo implements IWorkRepository {
  private model: mongoose.Model<typeof WorkSchema>

  constructor (connection: mongoose.Connection) {
    this.model = connection.model('Work', WorkSchema)
  }

  async save (work: Work) {
    const newWork = new this.model(work.toJSON())
    await newWork.save()
  }

  async get (options?: GetOptions): Promise<Work | undefined> {
    const document = await this.model
      .findOne<Work>({
        $or: [{ id: options?.id }, { userId: options?.userId }]
      })
      .exec()

    if (document) {
      return new Work(document)
    } else {
      throw new ApplicationError(
        `Work id=${options?.id} OR userId=${options?.userId}`
      )
    }
  }

  async update (work: Work) {}

  async delete (work: Work) {}
}
