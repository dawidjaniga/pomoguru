import React from 'react'
import { model, useTimeLeft } from '@pomoguru/client'

import { Progress } from 'antd'

import { ProgressProps } from 'antd/lib/progress'
import { Phase } from '@pomoguru/client'

const phaseMap: Record<Phase, ProgressProps['status']> = {
  idle: 'exception',
  work: 'exception',
  break: 'success',
  paused: 'active'
}

export default function TimeLeft () {
  const { percentCompleted, formattedSeconds } = useTimeLeft()
  const phase = model.get('phase')
  const status = phaseMap[phase]
  const percent = percentCompleted * 100

  return (
    <div>
      <Progress
        type='circle'
        percent={percent}
        status={status}
        width={240}
        format={() => formattedSeconds}
      />
    </div>
  )
}
