import styled from 'styled-components'
import Button from '../../components/Button'
import Header from './components/Header'
import Layout from '../../components/Layout'

import { actions, usePhase } from '../../pomoguru/pomoguru-react'
import TimeLeft from './components/TimeLeft'
import { Phase } from '../../pomoguru/objects/model'

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
      <Header />
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
