import './App.css'

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import Home from 'features/Home'
import React from 'react'
import SlackInstalation from 'features/SlackInstalation'
import styled from 'styled-components'

const Window = styled.main`
  background: var(--window-background);
  padding: 25px;
  border-radius: 24px;
  border: none;
`

function App () {
  return (
    <Router>
      <Window>
        <Switch>
          <Route path='/slack-installation'>
            <SlackInstalation />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </Window>
    </Router>
  )
}

export default App
