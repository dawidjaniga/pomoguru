import React from 'react';
import styles from './Home.css';
import SlackService from './../services/slack'
import LocalStoreService from './../services/localStore'

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <h2>Home</h2>
      <a onClick={SlackService.goIntoFocus}>Go to focus</a>
      <a onClick={SlackService.endFocus}>End focus</a>
      <a onClick={() => LocalStoreService.set('slack-token', '')}>Reset token</a>

    </div>
  );
}
