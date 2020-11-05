import Slack from 'slack'
import addMinutes from 'date-fns/addMinutes'
import format from 'date-fns/format'
import getUnixTime from 'date-fns/getUnixTime'
import shortid from 'shortid'

const token = localStorage.getItem('slack-token')
const id = localStorage.getItem('slack-id')
let slack: any

if (token) {
  initSlackClient(token)
} else {
  console.log('init: no slack token')
}

if (!id) {
  localStorage.setItem('slack-id', shortid.generate())
}

const pomodoroEmoji = ':tomato:'

interface Status {
  text: string
  emoji: string
  expireTime: Date | number
}

function initSlackClient (token: string) {
  console.log('init Slack client')
  // @ts-ignore
  slack = new Slack({ token })
}

async function changeStatus ({ text, emoji, expireTime }: Status) {
  try {
    const result = await slack.users.profile.set({
      profile: JSON.stringify({
        status_text: text,
        status_emoji: emoji,
        status_expiration: getUnixTime(expireTime)
      })
    })
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}

async function goIntoFocus (focusPhaseDurationInMinutes: number) {
  try {
    const pomodoroEndTime = addMinutes(new Date(), focusPhaseDurationInMinutes)
    await slack.dnd.setSnooze({ num_minutes: focusPhaseDurationInMinutes })
    await changeStatus({
      text: `Focusing till ${format(pomodoroEndTime, 'HH:mm')}`,
      emoji: pomodoroEmoji,
      expireTime: pomodoroEndTime
    })
  } catch (error) {
    console.error(error)
  }
}

async function endFocus () {
  try {
    await slack.dnd.endSnooze()
    await changeStatus({
      text: '',
      emoji: '',
      expireTime: 0
    })
  } catch (error) {
    console.error(error)
  }
}

function setToken (token: string) {
  localStorage.setItem('slack-token', token)
  // @ts-ignore
  slack = new Slack({ useElectronNet: true, token })
}

function isInstalled () {
  return Boolean(localStorage.getItem('slack-token'))
}

function getId () {
  return localStorage.getItem('slack-id')
}

const api = { goIntoFocus, endFocus, setToken, isInstalled, getId }
export default api
