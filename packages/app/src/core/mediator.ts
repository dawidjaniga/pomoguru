import React from 'react'
import settings from 'api/settings'
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
  const focusPhaseDurationSeconds = settings.get(
    'focus-time-duration-in-seconds'
  )
  const breakPhaseDurationSeconds = settings.get(
    'break-time-duration-in-seconds'
  )

  const dndMinutes = timeLeft / 60
  const focusTimeLeftMinutes = dndMinutes === 0 ? 1 : dndMinutes

  const api = React.useMemo(() => {
    return {
      onInit () {
        setTimeLeft(focusPhaseDurationSeconds)
        ipcRenderer.send('set-timer', focusPhaseDurationSeconds)
      },
      onStartClick () {
        phase = Phase.focus

        start()

        slack.goIntoFocus(focusTimeLeftMinutes)
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
        slack.goIntoFocus(focusTimeLeftMinutes)
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
  }, [start, pause, stop, focusTimeLeftMinutes, timeLeft])

  useEffect(() => {
    api.onTimerUpdate(timeLeft)
  }, [api, timeLeft])

  return api
}
