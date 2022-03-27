import { WorkDTO, WorkStatus } from './../interfaces/work'

import { WorkId } from '../interfaces/work'
import { nanoid } from 'nanoid'
import { Second, UserId } from '@server/types'

export type WorkConstructor = {
  id?: WorkId
  userId: UserId
  startDate?: string
  elapsedTime?: Second
  status?: WorkStatus
}

export class Work {
  private _id: WorkId
  private _startDate: Date
  private _elapsedTime: Second
  private _status: WorkStatus
  private _userId: UserId

  constructor (options: WorkConstructor) {
    this._id = options.id ?? (nanoid() as WorkId)
    this._userId = options.userId
    this._startDate = options.startDate
      ? new Date(options.startDate)
      : new Date()
    this._elapsedTime = options.elapsedTime ?? (0 as Second)
    this._status = options.status ?? 'active'
  }

  get id (): WorkId {
    return this._id
  }

  get userId (): UserId {
    return this._userId
  }

  get status (): WorkStatus {
    return this._status
  }

  start () {
    this._status = 'active'
  }

  finish () {
    this._status = 'finished'
  }

  pause () {
    this._status = 'paused'
  }

  toJSON (): WorkDTO {
    return {
      id: String(this._id),
      userId: String(this._userId),
      startDate: this._startDate.toJSON(),
      elapsedTime: Number(this._elapsedTime),
      status: this.status
    }
  }
}
