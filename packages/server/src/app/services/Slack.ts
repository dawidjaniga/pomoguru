import getUnixTime from 'date-fns/getUnixTime'
import { ApplicationError } from '@server/types/errors'
import axios from 'axios'
import qs from 'qs'

type AuthorizeResponse = {
  ok: boolean
  error: string
  authed_user: {
    access_token: string
  }
}

type ProfileResponse = {
  ok: boolean
  error: string
}
interface Status {
  text: string
  emoji: string
  expireTime: Date | number
}

export class Slack {
  static async authorize (code: string): Promise<string> {
    const { data } = await axios.post<AuthorizeResponse>(
      'https://slack.com/api/oauth.v2.access',
      qs.stringify({
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: 'https://localhost:4200/slack'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    if (data.ok && data.authed_user.access_token) {
      return data.authed_user.access_token
    } else {
      throw new ApplicationError(`Slack oauth error: ${data.error}`)
    }
  }

  static async changeStatus (
    { text, emoji, expireTime }: Status,
    userToken: string
  ) {
    const payload = qs.stringify({
      token: userToken,
      profile: JSON.stringify({
        status_text: text,
        status_emoji: emoji,
        status_expiration: getUnixTime(expireTime)
      })
    })
    const { data } = await axios.post<ProfileResponse>(
      'https://slack.com/api/users.profile.set',
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    console.log('payload', payload, data)

    if (!data.ok) {
      throw new ApplicationError(`Slack Profile Set error: ${data.error}`)
    }
  }
}
