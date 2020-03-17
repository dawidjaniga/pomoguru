import React, { useState } from 'react';
import axios from 'axios';
import styles from './Home.css';
import {
  shell,

} from 'electron';
import shortid from 'shortid'
import localStore from './../services/localStore'

const slackUserScopes = ['chat:write', 'dnd:write', 'users.profile:write'].join(',')
const slackClientId = '866674528645.977369566150'

class SlackTokenChecker extends React.Component<{ state: string, shouldCheck: boolean }> {
  timerId = 0
  intervalInMs = 4000

  startChecking = () => {
    this.stopChecking()
    this.timerId = window.setInterval(this.checkToken.bind(this), this.intervalInMs);
  }

  componentDidUpdate() {
    if (this.props.shouldCheck) {
      this.startChecking();
    } else {
      this.stopChecking()
    }
  }

  componentWillUnmount() {
    this.stopChecking()
  }

  stopChecking() {
    clearInterval(this.timerId);
  }

  async checkToken() {
    const { data } = await axios.get(`https://europe-west1-pomoguru-1da9b.cloudfunctions.net/getToken?state=${this.props.state}`)

    if (data) {
      this.stopChecking()
      localStore.set('slack-token', data.token)
    }
  }

  render() {
    return null
  }
}

export default function Home() {
  const [slackButtonClicked, setSlackButtonClicked] = useState(false)
  const state = shortid.generate()
  function openSlack() {
    setSlackButtonClicked(true)
    shell.openExternal(
      `https://slack.com/oauth/v2/authorize?user_scope=${slackUserScopes}&client_id=${slackClientId}&state=${state}`
    );
  }

  return (
    <div className={styles.container} data-tid="container">
      <h2>Slack Installation</h2>
      <SlackTokenChecker state={state} shouldCheck={slackButtonClicked} />
      <img onClick={openSlack} alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" />
      {/* <a href={`https://slack.com/oauth/v2/authorize?scope=${slackScopes.join(',')}&client_id=${slackClientId}`}>
        <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" />
      </a> */}
    </div>
  );
}
