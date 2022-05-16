import styled from 'styled-components'
import Button from '../../components/Button'
import Layout from '../../components/Layout'

import { getUseCase, useCase } from '@pomoguru/client'
import { Phase } from '@pomoguru/client'
import TimeLeft from './components/TimeLeft'
import { GetTimersUseCase } from 'packages/client/src/domain/timer/useCase/GetTimers'

const pomoguru = {
  timer: {
    startPomodoro: async () => {
      /*
      IDE Support
      TypeScript Support
      Singletons / Object Pool?

      Allow direct import? No: fragile dependencies, expose public API via Facade
        Import by ExampleUseCase class
        Use file like a key for search in object pool

      Treat like closed, outside dependency?

      ---------
      2 Actors

        - React Hook - useCase(...)
        - Imperative Code - Triggered by Events
            Should be used directly? 
          
          <Button onClick={pomoguru.timer.startPomodoro}>Start</Button>



      */

      const useCase = getUseCase('timer.startPomodoro')

      await useCase.execute()
    },
    pausePomodoro: async () => {
      const useCase = getUseCase('timer.pausePomodoro')

      await useCase.execute()
    },
    skipPomodoro: async () => {
      const useCase = getUseCase('timer.skipPomodoro')

      await useCase.execute()
    },
    skipBreak: async () => {
      const useCase = getUseCase('timer.skipBreak')

      await useCase.execute()
    }
  }
}

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
          <Button onClick={pomoguru.timer.startPomodoro}>Start</Button>
          {/* <Button onClick={GetTimersUseCase}>Start</Button> */}
        </DisplayPhase>
        <DisplayPhase phase='work'>
          <Button onClick={pomoguru.timer.pausePomodoro}>Pause</Button>
        </DisplayPhase>
        <DisplayPhase phase='paused'>
          <Button onClick={pomoguru.timer.startPomodoro}>Start</Button>
          <Button onClick={pomoguru.timer.skipPomodoro}>Skip pomodoro</Button>
        </DisplayPhase>
        <DisplayPhase phase='break'>
          <Button onClick={pomoguru.timer.skipBreak}>Skip break</Button>
        </DisplayPhase>
      </Content>
    </Layout>
  )
}
