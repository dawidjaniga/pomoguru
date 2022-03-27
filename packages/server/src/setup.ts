import * as dotenv from 'dotenv'
dotenv.config()

import Container from 'typedi'
import { AirtableWorkRepo } from '@server/repositories/AirtableWorkRepo'
import { AuthService } from '@server/app/services/Auth'
import { GoogleAuthService } from '@server/app/services/GoogleAuth'
import { MongoUserRepo } from '@server/repositories/MongoUserRepo'
import { MongoConnectionFactory } from '@server/infra/mongo'

const privateKey = (process.env.PRIVATE_KEY as string).replace(/\\n/g, '\n')

async function setup () {
  // @TODO: Use logger
  console.log('Server setup start...')
  const mongoConnection = await MongoConnectionFactory.getConnection(
    process.env.MONGODB_URI as string
  )
  Container.set('workRepo', new AirtableWorkRepo())
  Container.set('userRepo', new MongoUserRepo(mongoConnection))
  Container.set('authService', new AuthService(privateKey))
  Container.set(
    'googleAuthService',
    new GoogleAuthService(process.env.GOOGLE_CLIENT_ID as string)
  )
  console.log('Server setup ended.')
}

setup()
