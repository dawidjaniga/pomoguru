
import localStore from './localStore'
import addMinutes from 'date-fns/addMinutes'
import format from 'date-fns/format'
import getUnixTime from 'date-fns/getUnixTime'
// import Slack from 'slack'
// @ts-ignore
// const slack = new Slack({useElectronNet:true, token: localStore.get('slack-token')})
// const slack = new Slack({ token: localStore.get('slack-token') })

const focusTimeInMin = 25
const pomodoroEmoji = ':tomato:'

interface Status {
    text: string; emoji: string; expireTime: Date | number 
}

async function changeStatus ({ text, emoji, expireTime }: Status) {
  try {
    // const result = await slack.users.profile.set({
    //   profile: JSON.stringify({
    //     status_text: text,
    //     status_emoji: emoji,
    //     status_expiration: getUnixTime(expireTime)
    //   })
    // })
    // console.log(result)
  } catch (error) {
    console.error(error)
  }
}

async function goIntoFocus () {
  try {
    const pomodoroEndTime = addMinutes(new Date(), focusTimeInMin)
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
    await changeStatus({
      text: '',
      emoji: '',
      expireTime: 0
    })

  } catch (error) {
    console.error(error)
  }
}

export default { goIntoFocus, endFocus }
