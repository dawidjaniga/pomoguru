import * as airtable from 'airtable'
const base = airtable.base('appbIdDn5Lzb6WxQP')
const intervals = base('work')

import { Work } from '@server/entities/work'
import { GetOptions, IWorkRepository } from '../interfaces/work'

export class AirtableWorkRepo implements IWorkRepository {
  async save (work: Work) {
    const dto = { ...work.toJSON() }

    // @TODO: How to handle rawid vs id?
    await intervals.create([
      {
        fields: {
          rawid: dto.id,
          userId: dto.userId,
          startDate: dto.startDate,
          elapsedTime: dto.elapsedTime,
          status: dto.status
        }
      }
    ])
  }

  async get (options?: GetOptions): Promise<Work | undefined> {
    const result = await intervals
      .select({
        maxRecords: 1,
        filterByFormula: `{userId}='${options?.userId}'`
      })
      .firstPage()
    const fields = result[0].fields

    const work = new Work({ ...fields, id: fields.rawid })

    return work
  }

  async update (work: Work) {
    const result = await intervals
      .select({
        maxRecords: 1,
        filterByFormula: `{rawid}='${work?.id}'`
      })
      .firstPage()

    const item = result[0]

    if (item) {
      const dto = { ...work.toJSON() }

      await intervals.update([
        {
          id: item.id,
          fields: {
            rawid: dto.id,
            userId: dto.userId,
            startDate: dto.startDate,
            elapsedTime: dto.elapsedTime,
            status: dto.status
          }
        }
      ])
    }
  }

  async delete (work: Work) {
    const result = await intervals
      .select({
        maxRecords: 10
      })
      .firstPage()

    return result
  }
}
