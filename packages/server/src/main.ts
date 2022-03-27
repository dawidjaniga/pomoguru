import '@server/setup'
import { IUserRepository } from '@server/interfaces/user'
import { Container } from 'typedi'
import cookie from 'fastify-cookie'

import { ApplicationError } from './types/errors'
import { StartWorkUseCase } from './useCases/startWork'
import { PauseWorkUseCase } from './useCases/pauseWork'

import { UserId } from './types'

import { LoginFederatedUserUseCase } from './useCases/loginFederatedUser'
import { AuthService } from './app/services/Auth'

import fastify from 'fastify'
import fastifyIO from 'fastify-socket.io'
import fastifyCors from 'fastify-cors'

const DEFAULT_PORT = 4000

const server = fastify({
  // logger: {
  //   prettyPrint: true,
  //   level: 'trace'
  // }
})
server.register(fastifyIO, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
})

server.get('/', (req, reply) => {
  server.io.emit('hello')
  reply.send('Pomoguru API')
})

// @TODO: divide between developemnt and prod
server.register(fastifyCors, {
  origin: 'http://localhost:3000',
  credentials: true
})

server.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  parseOptions: {
    httpOnly: true,
    secure: true,
    signed: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  }
})

interface TimerStartBody {
  userId: UserId
}
interface PusherAuthBody {
  socket_id: string
  channel_name: string
  callback: string
}

server.decorateRequest('userId', '')

server.register((instance, _, done) => {
  instance.addHook('onRequest', (req, reply, done) => {
    try {
      const authTokenCookie = req.unsignCookie(req.cookies.authToken)
      const authService = Container.get<AuthService>('authService')

      if (authTokenCookie.valid && authTokenCookie.value) {
        const response = authService.verifyJwt(authTokenCookie.value)

        if (response) {
          // @ts-ignore
          req.userId = response.userId
          done()
        } else {
          throw new ApplicationError('JWT Token malformed')
        }
      } else {
        throw new ApplicationError('Auth cookie not found')
      }
    } catch (e) {
      console.error('Authorization error', e)
      reply.code(401).send({
        message: 'Not Authorized'
      })
    }
  })

  instance.get('/user', async (req, reply) => {
    try {
      const userRepo = Container.get<IUserRepository>('userRepo')
      // @ts-ignore
      const { userId } = req
      const user = await userRepo.get({ id: userId })

      reply.code(200).send({
        data: {
          user: user?.toJSON()
        }
      })
    } catch (e) {
      if (e instanceof ApplicationError) {
        reply.code(400).send(e.message)
      }

      if (e instanceof Error) {
        reply.code(500).send(e.message)
      }
    }
  })

  instance.get<{ Querystring: PusherAuthBody }>(
    '/websockets/auth',
    async (req, reply) => {
      try {
        // @ts-ignore
        const { userId } = req
        // const userRepo = Container.get<IUserRepository>('userRepo')
        // const user = await userRepo.get({ userId })
        const channelName = req.query.channel_name

        if (channelName.includes(userId)) {
          reply.code(200).send({
            data: 'some auth confirmation or token'
          })
        } else {
          reply.code(403).send({
            message: 'Forbidden'
          })
        }
      } catch (e) {
        console.error(e)

        if (e instanceof ApplicationError) {
          reply.code(400).send(e.message)
        }

        if (e instanceof Error) {
          reply.code(500).send(e.message)
        }
      }
    }
  )

  instance.post('/timer/start', async (req, reply) => {
    try {
      // @ts-ignore
      const { userId } = req
      const useCase = new StartWorkUseCase()

      await useCase.execute({ userId })

      reply.code(200).send({
        message: 'Timer started'
      })
    } catch (e) {
      if (e instanceof ApplicationError) {
        reply.code(400).send({ message: e.message })
      }

      if (e instanceof Error) {
        reply.code(500).send(e.message)
      }

      console.error(e)
      reply.code(500).send('Unexpected error: ' + e)
    }
  })

  server.post('/timer/pause', async (req, reply) => {
    try {
      const { userId } = req.body as TimerStartBody
      const useCase = new PauseWorkUseCase()

      await useCase.execute({ userId })

      reply.code(200).send()
    } catch (e) {
      if (e instanceof ApplicationError) {
        reply.code(400).send(e.message)
      }

      if (e instanceof Error) {
        reply.code(500).send(e.message)
      }
    }
  })

  done()
})

interface GoogleLoginRequest {
  jwtToken: string
}

server.post<{ Body: GoogleLoginRequest }>(
  '/login/google',
  async (req, reply) => {
    try {
      const { jwtToken } = req.body
      const useCase = new LoginFederatedUserUseCase()
      const authToken = await useCase.execute({ jwtToken, provider: 'google' })

      if (authToken) {
        reply
          .setCookie('authToken', authToken)
          .code(200)
          .send({
            authToken,
            message: 'User logged in'
          })
      } else {
        throw new ApplicationError('Cant create authToken')
      }
    } catch (e) {
      if (e instanceof ApplicationError) {
        reply.code(400).send(e.message)
      }

      if (e instanceof Error) {
        reply.code(500).send(e.message)
      }

      console.error(e)
      reply.code(500).send('Unexpected error: ' + e)
    }
  }
)

// Run the server!
const start = async () => {
  try {
    await server.ready()
    server.io.on('connection', socket => {
      socket.on('main-channel', (...args) => {
        console.log('main channel message', args)
      })
    })

    const port = process.env.PORT || DEFAULT_PORT
    console.log('Starting server on port: ', port)

    await server.listen(port)
  } catch (err) {
    console.log('Server start error', err)
    server.log.error(err)
    process.exit(1)
  }
}
start()
