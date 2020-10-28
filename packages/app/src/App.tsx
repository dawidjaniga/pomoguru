import React from 'react'
import './App.css'
import styled from 'styled-components'
import format from 'date-fns/format'
import { useTimer } from './timer'
import { useMediator } from './mediator'
import localStore from './api/localStore'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import SlackInstalationPage from './features/slack-instalation'

const Window = styled.main`
  background: var(--window-background);
  box-shadow: 0px 4px 12px 0px 0, 0, 0, 0.2;
  padding: 25px;
  border-radius: 24px;
  border: none;
`

const Title = styled.div`
  color: var(--text-color);
  padding-bottom: 20px;
  border-bottom: 1px solid var(--title-border-color);
  display: flex;
  justify-content: space-between;
`

const CloseLink = styled.a`
  color: var(--text-color);
`

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  width: 46%;
`

const Timer = styled.div`
  color: var(--text-color);
  font-size: 58px;
  font-weight: 600;
  line-height: 79px;
  text-align: center;
`

const Button = styled.button`
  color: var(--text-color);
  background: var(--button-background);
  padding: 5px 18px;
  border: 1px solid var(--dark-grey);
  border-radius: 8px;
  margin: 0 4px;
  outline: none;
  cursor: pointer;
`

function Home () {
  const { onStartClick, onPauseClick, onStopClick } = useMediator()
  const [{ timeLeft, isActive }] = useTimer()
  const slackAuthorized = localStore.get('slack-token')

  return (
    <>
      <Title>
        <div>
          PomoGuru <img src='icon-small.png' />
        </div>
        <CloseLink>x</CloseLink>
      </Title>
      <Content>
        <Timer>{format(new Date(timeLeft * 1000), 'mm:ss')}</Timer>
        <Buttons>
          {isActive ? (
            <>
              <Button onClick={onPauseClick}>Pause</Button>
              <Button onClick={onStopClick}>Stop</Button>
            </>
          ) : (
            <Button onClick={onStartClick}>Start</Button>
          )}
        </Buttons>
        {!slackAuthorized && (
          <Link to='/slack-installation'>Connect to Slack</Link>
        )}
      </Content>
    </>
  )
}

function App () {
  return (
    <Router>
      <Window>
        <Switch>
          <Route path='/slack-installation'>
            <SlackInstalationPage />
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
