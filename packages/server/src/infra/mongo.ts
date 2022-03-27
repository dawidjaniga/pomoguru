import * as mongoose from 'mongoose'

export class MongoConnectionFactory {
  static async getConnection (uri: string): Promise<mongoose.Connection> {
    return await mongoose.createConnection(uri).asPromise()
  }
}
