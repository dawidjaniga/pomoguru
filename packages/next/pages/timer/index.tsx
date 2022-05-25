import styled from 'styled-components'
import Button from '../../components/Button'
import Layout from '../../components/Layout'

import { getUseCase, useCase } from '@pomoguru/client'
import { Phase } from '@pomoguru/client'
import TimeLeft from './components/TimeLeft'

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
  const { loaded, data, error } = useCase('timer.getTimers')

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
          <Button onClick={() => getUseCase('timer.startPomodoro').execute()}>
            Start
          </Button>
        </DisplayPhase>
        <DisplayPhase phase='work'>
          <Button onClick={() => getUseCase('timer.pausePomodoro').execute()}>
            Pause
          </Button>
        </DisplayPhase>
        <DisplayPhase phase='paused'>
          <Button onClick={() => getUseCase('timer.startPomodoro').execute()}>
            Start
          </Button>
          <Button onClick={() => getUseCase('timer.skipPomodoro').execute()}>
            Skip pomodoro
          </Button>
        </DisplayPhase>
        <DisplayPhase phase='break'>
          <Button onClick={() => getUseCase('timer.skipBreak').execute()}>
            Skip break
          </Button>
        </DisplayPhase>
      </Content>
    </Layout>
  )
}
