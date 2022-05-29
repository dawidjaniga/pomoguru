import { app } from '../../app'
import styled from 'styled-components'
import Button from '../../components/Button'
import Layout from '../../components/Layout'

import { Phase } from '@pomoguru/client'
import TimeLeft from './components/TimeLeft'
import { useTimers } from './../../glue'

const AppName = styled.h1`
  font-size: 48px;
  text-align: center;
  font-family: Helvetica;
  font-weight: 800;
  padding: 40px;
  margin: 0;
`

const Content = styled.div`
  text-align: center;
  padding: 0 60px 120px;
`

const Timer = styled.div`
  padding-bottom: 50px;
`

type DisplayProps = {
  phase: Phase
}

function DisplayPhase (props: React.PropsWithChildren<DisplayProps>) {
  const { loaded, data, error } = useTimers()

  if (loaded) {
    if (error) {
      return <>Error occured: {error.toString()}</>
    }

    if (data) {
      const { phase } = data

      return props.phase === phase ? <>{props.children}</> : null
    }
  }

  return <>Loading...</>
}

export default function TimerPage () {
  return (
    <Layout>
      <AppName>Pomoguru</AppName>
      <Content>
        <Timer>
          <TimeLeft />
        </Timer>
        <DisplayPhase phase='idle'>
          <Button onClick={() => app.startPomodoro()}>Start</Button>
        </DisplayPhase>
        <DisplayPhase phase='work'>
          <Button onClick={() => app.pausePomodoro()}>Pause</Button>
        </DisplayPhase>

        <DisplayPhase phase='paused'>
          <Button onClick={() => app.startPomodoro()}>Start</Button>
          <Button onClick={() => app.skipPomodoro()}>Skip pomodoro</Button>
        </DisplayPhase>
        <DisplayPhase phase='break'>
          <Button onClick={() => app.skipBreak()}>Skip break</Button>
        </DisplayPhase>
      </Content>
    </Layout>
  )
}
