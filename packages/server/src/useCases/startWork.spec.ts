import { WorkRepoSpy } from '../testObjects/workRepoSpy'
import Container from 'typedi'
import { UserId } from '@server/types'
import { StartWorkUseCase } from './startWork'

describe('Start Work Use Case', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should start Work phase when user exists', async () => {
    // given
    jest.setSystemTime(new Date('2022-01-28T23:36:07.306Z'))
    const userId = '123' as UserId
    const useCase = new StartWorkUseCase()
    const workRepo = new WorkRepoSpy()
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
      status: 'active'
    })
  })

  it('should throw error when user does not exist', async () => {
    // given

    const useCase = new StartWorkUseCase()

    // when
    expect(() => useCase.execute({ userId: '' as UserId })).rejects.toThrow(
      'UserId is not specified'
    )
  })
})
