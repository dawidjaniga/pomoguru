import { UserId } from '@server/types'
import { Work } from './work'

describe('Work', () => {
  const userId = '123' as UserId

  it('should start timer', () => {
    const work = new Work({ userId })
    work.start()

    expect(work.status).toBe('active')
  })

  it('should pause timer', () => {
    const work = new Work({ userId })
    work.pause()

    expect(work.status).toBe('paused')
  })

  it('should finish timer', () => {
    const work = new Work({ userId })
    work.finish()

    expect(work.status).toBe('finished')
  })
})
