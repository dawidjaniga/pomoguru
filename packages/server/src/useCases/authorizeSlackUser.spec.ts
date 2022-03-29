import { SlackTokenRepoSpy } from './../testObjects/slackTokenRepoSpy'
import Container from 'typedi'
import { UserId } from '@server/types'
import { AuthorizeSlackUserUseCase } from './authorizeSlackUser'
import * as slack from 'slack'

jest.mock('slack')

describe('Authorize Slack User Use Case', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should exchange temporary token with Slack for User Token', async () => {
    // given
    jest.setSystemTime(new Date('2022-01-28T23:36:07.306Z'))
    const userId = '123' as UserId
    const code = 'temporary-token'
    const useCase = new AuthorizeSlackUserUseCase()
    const slackTokenRepo = new SlackTokenRepoSpy()
    Container.set('slackTokenRepo', slackTokenRepo)

    const mockedResponse = {
      ok: true,
      access_token: 'xoxo-user-token'
    }

    // @TODO: How to properly type this?
    // @ts-ignore
    slack.oauth.access.mockResolvedValue(mockedResponse)

    // when
    await useCase.execute({ userId, code })

    // then
    expect(slack.oauth.access).toHaveBeenCalledWith({
      client_id: 'client_id',
      client_secret: 'client_secret',
      code: 'temporary-token'
    })
    const slackToken = await slackTokenRepo.get({ userId })

    expect(slackTokenRepo.getTimesSaveCalled()).toBe(1)
    expect(slackToken?.toJSON()).toMatchObject({
      userId,
      token: 'xoxo-user-token',
      createdAt: '2022-01-28T23:36:07.306Z'
    })
  })

  it('should throw error when input is incorrect', async () => {
    // given
    jest.setSystemTime(new Date('2022-01-28T23:36:07.306Z'))
    const useCase = new AuthorizeSlackUserUseCase()
    const slackTokenRepo = new SlackTokenRepoSpy()
    Container.set('slackTokenRepo', slackTokenRepo)

    // when then
    expect(() =>
      useCase.execute({ userId: 'xyz' as UserId, code: '' })
    ).rejects.toThrow('Code is not specified')

    // when then
    expect(() =>
      useCase.execute({ userId: '' as UserId, code: 'qwerty' })
    ).rejects.toThrow('UserId is not specified')
  })
})
