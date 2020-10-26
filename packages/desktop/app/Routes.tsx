import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';

import localStore from './services/localStore'
import SlackInstallationPage from './containers/SlackInstallation';

const isSlackInstalled = localStore.get('slack-token')

export default function Routes() {
  return (
    <App>
      <Router>
      <Switch>
        
        <Route path={routes.HOME}>
          {isSlackInstalled ? HomePage : SlackInstallationPage}
        </Route>
      </Switch>
      </Router>
    </App>
  );
}
