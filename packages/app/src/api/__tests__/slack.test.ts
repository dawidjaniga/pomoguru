import slack from 'api/slack'
import addMinutes from 'date-fns/addMinutes'

const usersProfileMock = jest.fn()

jest.mock('slack', () => {
  return () => ({
    users: {
      profile: {
        set: usersProfileMock
      }
    }
  })
})

describe('Slack API', () => {
  const mockedDate = new Date('27 Jan 2021 00:10:00 GMT')
  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(mockedDate.getTime())
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  // endFocus, setToken, getId

  it('should set token', () => {
    slack.setToken('qwerty')
    expect(localStorage.getItem('slack-token')).toBe('qwerty')
    expect(slack.getClient()).not.toBeNull()
  })

  it('should return true when Slack is initialized', () => {
    slack.setToken('qwerty')
    // @TODO: change name to initialized
    expect(slack.isInstalled()).toBeTruthy()
  })

  it('should change status', () => {
    slack.goIntoFocus(25)
    expect(usersProfileMock).toBeCalledWith({
      profile: JSON.stringify({
        text: `Focusing till 00:35`,
        emoji: ':tomato:',
        expireTime: addMinutes(mockedDate, 25)
      })
    })
  })
})
