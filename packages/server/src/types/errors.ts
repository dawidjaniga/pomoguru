export class BaseError extends Error {
  constructor (message: string) {
    super(message)
  }
}

export class ApplicationError extends BaseError {}
export class NotFoundError extends BaseError {}
