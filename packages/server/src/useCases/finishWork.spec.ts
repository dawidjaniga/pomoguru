import { WorkRepoSpy } from '../testObjects/workRepoSpy'
import Container from 'typedi'
import { UserId } from '@server/types'
import { Work } from '../entities/work'
import { FinishWorkUseCase } from './finishWork'

describe('Finish Work Use Case', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should finish Work phase when work and user exists', async () => {
    // given
    jest.setSystemTime(new Date('2022-01-28T23:36:07.306Z'))
    const userId = '123' as UserId
    const useCase = new FinishWorkUseCase()
    const workRepo = new WorkRepoSpy([
      new Work({
        userId
      })
    ])
    Container.set('workRepo', workRepo)

    // when
    await useCase.execute({ userId })

    // then
    const work = await workRepo.get({ userId })

    expect(workRepo.getTimesSaveCalled()).toBe(1)
    expect(work?.toJSON()).toMatchObject({
      id: expect.any(String),
      userId,
      elapsedTime: 0,
      startDate: '2022-01-28T23:36:07.306Z',
      status: 'finished'
    })
  })

  it('should throw error when work phase does not exist', async () => {
    // given
    const userId = '123' as UserId
    const useCase = new FinishWorkUseCase()
    const workRepo = new WorkRepoSpy()
    Container.set('workRepo', workRepo)

    // when
    expect(() => useCase.execute({ userId })).rejects.toThrow(
      'There is no active Work phase'
    )
  })

  it('should throw error when user does not exist', async () => {
    // given
    const useCase = new FinishWorkUseCase()

    // when
    expect(() => useCase.execute({ userId: '' as UserId })).rejects.toThrow(
      'UserId is not specified'
    )
  })
})
