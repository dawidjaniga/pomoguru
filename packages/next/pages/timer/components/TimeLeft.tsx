import React from 'react'
import { useCase } from '@pomoguru/client'

import { Progress } from 'antd'

import { ProgressProps } from 'antd/lib/progress'
import { Phase } from '@pomoguru/client'
import styled from 'styled-components'

const phaseMap: Record<Phase, ProgressProps['status']> = {
  idle: 'exception',
  work: 'exception',
  break: 'success',
  paused: 'active'
}

const Wrapper = styled.div`
  &.paused {
    .ant-progress-text {
      color: #fff;
    }
  }
`

// function useCombinedTimers () {
//   const pomodoroTimer = useCase('timer.getTimer')
//   const breakTimer = useCase('timer.getBreakTimer')

//   return {
//     ...pomodoroTimer,
//     ...breakTimer
//   }
// }
export default function TimeLeft () {
  const { loaded, data, error } = useCase('timer.getTimers')

  if (loaded) {
    if (error) {
      return <>Error occured: {error.toString()}</>
    }

    if (data) {
      const { timeLeft, progress, phase } = data
      const status = phaseMap[phase]
      const percent = progress * 100

      return (
        <Wrapper className={phase}>
          <Progress
            type='circle'
            percent={percent}
            status={status}
            width={240}
            format={() => timeLeft}
          />
        </Wrapper>
      )
    }
  }

  return <>Loading...</>
}
