import styled from 'styled-components'
import Button from '../../components/Button'
import Layout from '../../components/Layout'

import { actions, usePhase } from '@pomoguru/client'
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
  const phase = usePhase()

  return props.phase === phase ? <>{props.children}</> : null
}

function Phase () {
  const phase = usePhase()
  return <>{phase}</>
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
          <Button onClick={actions.startWork}>Start</Button>
        </DisplayPhase>
        <DisplayPhase phase='work'>
          <Button onClick={actions.pauseWork}>Pause</Button>
        </DisplayPhase>
        <DisplayPhase phase='paused'>
          <Button onClick={actions.startWork}>Start</Button>
          <Button onClick={actions.cancelWork}>Cancel work</Button>
        </DisplayPhase>
        <DisplayPhase phase='break'>
          <Button onClick={actions.skipBreak}>Skip break</Button>
        </DisplayPhase>
      </Content>
    </Layout>
  )
}
