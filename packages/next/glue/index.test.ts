import { useTimers } from '.'

describe('Glue between React and Pomoguru Client ', () => {
  it('useTimers should subscribe to GetTimers', () => {
    expect(useTimers()).toBe({ data: '25:00' })
  })
})
