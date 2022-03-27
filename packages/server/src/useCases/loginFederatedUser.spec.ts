import Container from 'typedi'
import { LoginFederatedUserUseCase } from './loginFederatedUser'
import { UserRepoSpy } from '../testObjects/userRepoSpy'
import { User } from '../entities/user'
import { AuthService } from '../app/services/Auth'

const examplePrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6vUp
wmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/3j+skZ6UtW+5u09lHNsj6tQ5
1s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQABAoGAFijko56+qGyN8M0RVyaRAXz++xTqHBLh
3tx4VgMtrQ+WEgCjhoTwo23KMBAuJGSYnRmoBZM3lMfTKevIkAidPExvYCdm5dYq3XToLkkLv5L2
pIIVOFMDG+KESnAFV7l2c+cnzRMW0+b6f8mR1CJzZuxVLL6Q02fvLi55/mbSYxECQQDeAw6fiIQX
GukBI4eMZZt4nscy2o12KyYner3VpoeE+Np2q+Z3pvAMd/aNzQ/W9WaI+NRfcxUJrmfPwIGm63il
AkEAxCL5HQb2bQr4ByorcMWm/hEP2MZzROV73yF41hPsRC9m66KrheO9HPTJuo3/9s5p+sqGxOlF
L0NDt4SkosjgGwJAFklyR1uZ/wPJjj611cdBcztlPdqoxssQGnh85BzCj/u3WqBpE2vjvyyvyI5k
X6zk7S0ljKtt2jny2+00VsBerQJBAJGC1Mg5Oydo5NwD6BiROrPxGo2bpTbu/fhrT8ebHkTz2epl
U9VQQSQzY1oZMVX8i1m5WUTLPz2yLJIBQVdXqhMCQBGoiuSoSjafUhV7i1cEGpb88h5NBYZzWXGZ
37sJ5QsW+sJyoNde3xH8vdXhzU7eT82D6X/scw9RZz+/6rCJ4p0=
-----END RSA PRIVATE KEY-----`

describe('Login Federated User Use Case', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should login Google User if it exists', async () => {
    // given
    const jwtToken = 'eyJhb...CJ9'
    const useCase = new LoginFederatedUserUseCase()

    Container.set('authService', new AuthService(examplePrivateKey))
    const googleAuthService = {
      verify: jest.fn().mockReturnValue(
        Promise.resolve({
          email: 'johndoe@gmail.com'
        })
      )
    }
    Container.set('googleAuthService', googleAuthService)
    const userRepo = new UserRepoSpy([
      new User({
        email: 'johndoe@gmail.com'
      })
    ])
    Container.set('userRepo', userRepo)

    // when
    const authToken = await useCase.execute({ jwtToken, provider: 'google' })

    // then
    expect(typeof authToken).toBe('string')
  })

  it('should create user and login if user doesnt exist', async () => {
    // given
    jest.setSystemTime(new Date('2022-01-28T23:36:07.306Z'))
    const jwtToken = 'eyJhb...CJ9'
    const useCase = new LoginFederatedUserUseCase()

    Container.set('authService', new AuthService(examplePrivateKey))
    const googleAuthService = {
      verify: jest.fn().mockReturnValue(
        Promise.resolve({
          email: 'johndoe@gmail.com',
          picture: 'http://example.com/image.jpg'
        })
      )
    }
    Container.set('googleAuthService', googleAuthService)
    const userRepo = new UserRepoSpy()
    Container.set('userRepo', userRepo)

    // when
    const authToken = await useCase.execute({ jwtToken, provider: 'google' })

    // then
    const user = await userRepo.get({ email: 'johndoe@gmail.com' })

    expect(userRepo.getTimesSaveCalled()).toBe(1)
    expect(user?.toJSON()).toMatchObject({
      id: expect.any(String),
      email: 'johndoe@gmail.com',
      avatarUrl: 'http://example.com/image.jpg',
      createdAt: '2022-01-28T23:36:07.306Z'
    })
    expect(typeof authToken).toBe('string')
  })
})
