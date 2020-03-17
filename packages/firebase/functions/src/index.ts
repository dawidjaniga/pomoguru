import * as functions from 'firebase-functions'
import axios from 'axios'
import qs from 'qs'
import admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

function debug (obj: any) {
  console.log(JSON.stringify(obj, null, 2))
}

const slackClientId = functions.config().pomoguru.slackclientid
const slackClientSecret = functions.config().pomoguru.slackclientsecret

interface SlackToken {
  token: string
  state: string
}

async function exchangeSlackCode (code: string) {
  const requestBody = {
    code,
    client_id: slackClientId,
    client_secret: slackClientSecret
  }
  const result = await axios.post(
    'https://slack.com/api/oauth.v2.access',
    qs.stringify(requestBody),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  debug({ data: result.data })
  return result.data.authed_user.access_token
}

async function saveSlackToken ({ token, state }: SlackToken) {
  const tokenRef = db.collection('slack-tokens').doc(state)
  await tokenRef.set({
    token
  })
}

export const slackAuthorize = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    try {
      const { code, state } = request.query
      const token = await exchangeSlackCode(code)
      await saveSlackToken({ token, state })

      response.send({ code, state })
    } catch (e) {
      console.error(e)
    }
  })

export const getToken = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    const stateRef = db.collection('slack-tokens').doc(request.query.state)
    try {
      const stateDoc = await stateRef.get()
      const data = stateDoc.data()
      response.status(200).send(data)
    } catch (e) {
      debug(e)
      response.status(500).send('Internal server error')
    }
  })
