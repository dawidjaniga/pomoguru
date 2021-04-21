import { Phase } from 'types/timer'
import React from 'react'
import settings from 'api/settings'
import slack from 'api/slack'
import { useEffect } from 'react'
import { useTimer } from 'core/timer'
import notifications from 'services/notifications'

const { ipcRenderer } = window.require('electron')

let phase: Phase

export function useMediator () {
  const [
    { timeLeft },
    { start, pause, stop, setTimeLeft, setPhase }
  ] = useTimer()
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
        slack.goIntoFocus(focusTimeLeftMinutes)
        ipcRenderer.send('set-icon', 'icon-red-small.png')

        start()
        setPhase(Phase.focus)

        notifications.notify({
          body: 'All set! Focus time is on'
        })
      },
      onPauseClick () {
        phase = Phase.break
        ipcRenderer.send('set-icon', 'icon-green-small.png')
        
        pause()
        setPhase(Phase.idle)

        notifications.notify({
          body: 'Notifications turned on'
        })

        slack.endFocus()
      },
      onStopClick () {
        phase = Phase.break
        ipcRenderer.send('set-icon', 'icon-green-small.png')
        
        stop()
        setPhase(Phase.idle)

        notifications.notify({
          body: 'Notifications turned on'
        })

        slack.endFocus()
      },
      onBreakPhaseEnd () {
        phase = Phase.focus
        setPhase(Phase.focus)
        slack.goIntoFocus(focusTimeLeftMinutes)

        setTimeLeft(focusPhaseDurationSeconds)
        ipcRenderer.send('set-icon', 'icon-red-small.png')

        notifications.notify({
          body: 'All set! Focus time is on'
        })
      },
      onFocusPhaseEnd () {
        phase = Phase.break
        setPhase(Phase.break)
        slack.endFocus()
        setTimeLeft(breakPhaseDurationSeconds)
        ipcRenderer.send('set-icon', 'icon-green-small.png')

        notifications.notify({
          body: 'Great job! Break time'
        })
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
    // eslint-disable-next-line
  }, [start, pause, stop, focusTimeLeftMinutes, timeLeft])

  useEffect(() => {
    api.onTimerUpdate(timeLeft)
  }, [api, timeLeft])

  return api
}
