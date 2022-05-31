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
import { AuthorizeSlackUserUseCase } from './useCases/authorizeSlackUser'

import debugModule from 'debug'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'

const debug = debugModule('pomoguru:server')

const isDevelopment = process.env.NODE_ENV === 'development'

const server = fastify({
  logger: {
    prettyPrint: true,
    level: 'trace'
  }
})

const allowerdOrigins = ['https://pomoguru.app']

if (isDevelopment) {
  allowerdOrigins.push('https://localhost:4200', 'https://localhost:4202')
}

server.register(fastifyCors, {
  origin: allowerdOrigins,
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

server.register(fastifyIO, {
  cors: {
    origin: allowerdOrigins,
    credentials: true
  }
})

server.get('/', (_, reply) => {
  server.io.emit('hello')
  reply.send('Pomoguru API')
})

interface TimerStartBody {
  userId: UserId
}

server.decorateRequest('userId', '')

interface AuthorizeSlackRequest {
  code: string
}

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
        reply.code(500).send({ error: e.message })
      }

      console.error(e)
      reply.code(500).send('Unexpected error: ' + e)
    }
  })

  instance.post('/timer/pause', async (req, reply) => {
    try {
      const { userId } = req.body as TimerStartBody
      const useCase = new PauseWorkUseCase()

      await useCase.execute({ userId })

      reply.code(200).send()
    } catch (e) {
      if (e instanceof ApplicationError) {
        reply.code(400).send({ error: e.message })
      }

      if (e instanceof Error) {
        reply.code(500).send({ error: e.message })
      }
    }
  })

  // resotre state use case (the last working interval for the user)

  instance.post<{ Body: AuthorizeSlackRequest }>(
    '/slack/authorize',
    async (req, reply) => {
      try {
        // @ts-ignore
        const { userId } = req
        const { code } = req.body
        const useCase = new AuthorizeSlackUserUseCase()
        await useCase.execute({ userId, code })

        reply.code(200).send({ message: 'Authorized Slack user' })
      } catch (e) {
        if (e instanceof ApplicationError) {
          reply.code(400).send({ error: e.message })
        }

        if (e instanceof Error) {
          reply.code(500).send({ error: e.message })
        }

        console.error(e)
        reply.code(500).send('Unexpected error: ' + e)
      }
    }
  )

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
        reply.code(400).send({ error: e.message })
      }

      if (e instanceof Error) {
        reply.code(500).send({ error: e.message })
      }

      console.error(e)
      reply.code(500).send('Unexpected error: ' + e)
    }
  }
)

function getUserId (socket) {
  const authService = Container.get<AuthService>('authService')
  const authTokenCookie = server.unsignCookie(
    server.parseCookie(socket.handshake.headers.cookie).authToken
  )

  return authService.verifyJwt(authTokenCookie.value)
}

type NextMiddleware = (err?: ExtendedError) => void

function authMiddleware (socket: Socket, next: NextMiddleware) {
  debug('socket.io auth middleware socket.id=', socket.id)

  try {
    const user = getUserId(socket)

    if (user) {
      socket.data.userId = user.userId
      debug('authorized socket.data.userId', socket.data.userId)
      next()
    } else {
      debug('not authorized user')
      next(new Error('Unauthorized'))
    }
  } catch (e) {
    if (e instanceof Error) {
      debug('auth error', e)
      next(e)
    }
  }
}

// Run the server!
const start = async () => {
  try {
    await server.ready()
    debug('server ready')

    server.io.use(authMiddleware)

    const userNamespace = server.io.of('/users')
    userNamespace.use(authMiddleware)

    userNamespace.on('connection', async socket => {
      debug('user namespace connected', socket.id)
      const userRoom = 'u-' + socket.data.userId

      socket.join(userRoom)

      socket.onAny((event, ...args) => {
        debug('received event on user namespace', event, args)
      })

      socket.on('startPomodoro', async (occuredAt: number) => {
        try {
          const userId = socket.data.userId
          debug('socket user', socket.data)
          const useCase = new StartWorkUseCase()

          await useCase.execute({ userId })

          debug('Timer started')

          userNamespace.to(userRoom).emit('pomodoro:started', occuredAt)
        } catch (e) {
          console.error('Start Timer error: ' + e)
        }
      })

      socket.on('pausePomodoro', async (occuredAt: number) => {
        try {
          debug('pause pomodoro')

          userNamespace.to(userRoom).emit('pomodoro:paused', occuredAt)
        } catch (e) {
          console.error('Pause Pomodoro error: ' + e)
        }
      })

      socket.on('skipBreak', async () => {
        try {
          console.log({
            message: 'Break skipped'
          })

          userNamespace.to(userRoom).emit('breakSkipped', 'Break skipped')
        } catch (e) {
          console.error('Skip break error: ' + e)
        }
      })

      socket.on('cancelWork', async () => {
        try {
          console.log({
            message: 'Work canceled'
          })

          userNamespace.to(userRoom).emit('workCanceled', 'Work canceled')
        } catch (e) {
          console.error('Cancel work error: ' + e)
        }
      })
    })

    server.io.on('connection', async socket => {
      debug('socket connected', socket.id, socket.data)
      const userRepo = Container.get<IUserRepository>('userRepo')
      const user = (await userRepo.get({ id: socket.data.userId })).toJSON()

      socket.onAny((event, ...args) => {
        console.log('socket any', event, args)
      })

      debug('user', user)

      socket.emit('user:authorized', {
        id: user.id,
        email: user.email,
        avatarUrl: user.avatarUrl
      })
    })

    const DEFAULT_HOST = '0.0.0.0'
    const DEFAULT_PORT = 4000
    const host = process.env.HOST || DEFAULT_HOST
    const port = process.env.PORT || DEFAULT_PORT
    console.log(`Starting server on ${host}:${port}`)

    await server.listen(port, host)
  } catch (err) {
    console.log('Server start error', err)
    server.log.error(err)
    process.exit(1)
  }
}

try {
  start()
} catch (e) {
  console.error('Server error', e)
}
