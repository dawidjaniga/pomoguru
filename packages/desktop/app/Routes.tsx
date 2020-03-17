import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';

import localStore from './services/localStore'
import SlackInstallationPage from './containers/SlackInstallation';

const isSlackInstalled = localStore.get('slack-token')

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.HOME}>
          {isSlackInstalled ? HomePage : SlackInstallationPage}
        </Route>
      </Switch>
    </App>
  );
}
