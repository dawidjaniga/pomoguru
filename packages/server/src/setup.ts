import Container from 'typedi'
import { AuthService } from '@server/app/services/Auth'
import { GoogleAuthService } from '@server/app/services/GoogleAuth'
import { MongoUserRepo } from '@server/repositories/MongoUserRepo'
import { MongoConnectionFactory } from '@server/infra/mongo'
import { MongoWorkRepo } from '@server/repositories/MongoWorkRepo'
import { MongoSlackToken } from '@server/repositories/MongoSlackToken'

const privateKey = (process.env.PRIVATE_KEY as string).replace(/\\n/g, '\n')

async function setup () {
  // @TODO: Use logger
  console.log('Server setup start...')

  const mongoConnection = await MongoConnectionFactory.getConnection(
    process.env.MONGODB_URI as string
  )

  Container.set('workRepo', new MongoWorkRepo(mongoConnection))
  Container.set('userRepo', new MongoUserRepo(mongoConnection))
  Container.set('slackTokenRepo', new MongoSlackToken(mongoConnection))
  Container.set('authService', new AuthService(privateKey))
  Container.set(
    'googleAuthService',
    new GoogleAuthService(process.env.NX_GOOGLE_CLIENT_ID as string)
  )
  console.log('Server setup ended.')
}

setup()
