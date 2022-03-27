import { GoogleAuthService } from './GoogleAuth'
import { OAuth2Client } from 'google-auth-library'

let verifyIdToken = jest.fn()
jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        verifyIdToken
      }
    })
  }
})

describe('GoogleAuth Service', () => {
  const googleClientId = 'xyz-123'

  beforeEach(() => {
    verifyIdToken = jest.fn()
  })

  it('should create service instance', () => {
    new GoogleAuthService(googleClientId)
    expect(OAuth2Client).toBeCalledWith(googleClientId)
  })

  it('should return payload when token is correct', async () => {
    const token = '{token: "123"}'
    const service = new GoogleAuthService(googleClientId)

    verifyIdToken.mockImplementation(async () => {
      return Promise.resolve({
        getPayload () {
          return {
            user: 123
          }
        }
      })
    })

    const payload = await service.verify(token)

    expect(verifyIdToken).toHaveBeenCalledWith({
      idToken: token,
      audience: googleClientId
    })
    expect(payload).toEqual({
      user: 123
    })
  })
})
