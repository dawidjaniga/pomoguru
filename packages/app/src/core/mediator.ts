import React from 'react'
import slack from 'api/slack'
import { useEffect } from 'react'
import { useTimer } from 'core/timer'

const { ipcRenderer } = window.require('electron')

enum Phase {
  focus,
  break
}
let phase: Phase

export function useMediator () {
  const [{ timeLeft }, { start, pause, stop, setTimeLeft }] = useTimer()
  const focusPhaseDurationSeconds = 20
  const breakPhaseDurationSeconds = 5

  const api = React.useMemo(() => {
    return {
      onStartClick () {
        phase = Phase.focus

        start()
        slack.goIntoFocus()
        ipcRenderer.send('notify', 'All set! Focus time is on')
      },
      onPauseClick () {
        phase = Phase.break
        pause()
        ipcRenderer.send('notify', 'Notifications turned on')
        slack.endFocus()
      },
      onStopClick () {
        phase = Phase.break
        stop()
        ipcRenderer.send('notify', 'Notifications turned on')
        slack.endFocus()
      },
      onBreakPhaseEnd () {
        phase = Phase.focus
        slack.goIntoFocus()
        setTimeLeft(focusPhaseDurationSeconds)
        ipcRenderer.send('notify', 'All set! Focus time is on')
      },
      onFocusPhaseEnd () {
        phase = Phase.break
        slack.endFocus()
        setTimeLeft(breakPhaseDurationSeconds)
        ipcRenderer.send('notify', 'Great job! Now take a break :)')
      },
      onTimerUpdate (timeLeft: number) {
        if (timeLeft === 0) {
          switch (phase) {
            case Phase.focus:
              api.onFocusPhaseEnd()
              break

            case Phase.break:
              api.onBreakPhaseEnd()
              break
          }
        } else {
          ipcRenderer.send('set-timer', timeLeft)
        }
      }
    }
  }, [start, pause, stop])

  useEffect(() => {
    api.onTimerUpdate(timeLeft)
  }, [api, timeLeft])

  return api
}
