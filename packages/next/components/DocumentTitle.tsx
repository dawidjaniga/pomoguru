import { useEffect } from 'react'
import { Phase } from '@pomoguru/client/objects/model'
import { model } from '@pomoguru/client/react'

const phaseMap: Record<Phase, string> = {
  idle: 'start',
  work: 'focus',
  break: 'break',
  paused: 'continue'
}

function setTitle () {
  const { phase, formattedSeconds } = model.get('timeLeft')

  document.title = `${formattedSeconds} - time to ${phaseMap[phase]}`
}

export default function DocumentTitle () {
  useEffect(() => {
    setTitle()

    model.subscribe('timeLeft:changed', () => {
      setTitle()
    })
  }, [])

  return null
}
