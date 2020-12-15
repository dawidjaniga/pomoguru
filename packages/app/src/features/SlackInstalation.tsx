import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import WindowContent from 'core/components/WindowContent'
import WindowTitle from 'core/components/WindowTitle'
import axios from 'axios'
import slack from 'api/slack'

const { shell } = window.require('electron')

const slackUserScopes = ['chat:write', 'dnd:write', 'users.profile:write'].join(
  ','
)
const slackClientId = '866674528645.977369566150'

class SlackTokenChecker extends React.Component<{
  state: string
  shouldCheck: boolean
  onInstall: () => void
}> {
  timerId = 0
  intervalInMs = 1000

  startChecking = () => {
    this.stopChecking()
    this.timerId = window.setInterval(
      this.checkToken.bind(this),
      this.intervalInMs
    )
  }

  componentDidUpdate () {
    if (this.props.shouldCheck) {
      this.startChecking()
    } else {
      this.stopChecking()
    }
  }

  componentWillUnmount () {
    this.stopChecking()
  }

  stopChecking () {
    clearInterval(this.timerId)
  }

  async checkToken () {
    const { data } = await axios.get(
      `https://europe-west1-pomoguru-1da9b.cloudfunctions.net/getToken?state=${this.props.state}`
    )

    if (data) {
      this.stopChecking()
      slack.setToken(data.token)
      this.props.onInstall()
    }
  }

  render () {
    return null
  }
}

export default function SlackInstalationPage () {
  const [slackButtonClicked, setSlackButtonClicked] = useState(false)
  const [, forceRender] = useState(false)
  const state = slack.getId()
  function openSlack () {
    setSlackButtonClicked(true)
    shell.openExternal(
      `https://slack.com/oauth/v2/authorize?user_scope=${slackUserScopes}&client_id=${slackClientId}&state=${state}`
    )
  }

  function onInstall () {
    forceRender(true)
  }

  return (
    <>
      <WindowTitle>Slack Installation</WindowTitle>
      <WindowContent>
        {slack.isInstalled() ? (
          <>
            ✅ &nbsp;&nbsp;Slack Authorized
            <Link to='/'>Open timer</Link>
          </>
        ) : (
          <>
            {state && (
              <SlackTokenChecker
                state={state}
                shouldCheck={slackButtonClicked}
                onInstall={onInstall}
              />
            )}
            <img
              onClick={openSlack}
              alt='Add to Slack'
              height='40'
              width='139'
              src='https://platform.slack-edge.com/img/add_to_slack.png'
            />
          </>
        )}
      </WindowContent>
    </>
  )
}
