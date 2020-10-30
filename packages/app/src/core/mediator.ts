import React from 'react'
import slack from 'api/slack'
import { useEffect } from 'react';
import { useTimer } from 'core/timer';

const { ipcRenderer } = window.require("electron");


export function useMediator() {
    const [{ timeLeft }, { start, pause, stop }] = useTimer()

    const api = React.useMemo(() => {
    return {
        onStartClick() {
            start()
            slack.goIntoFocus()
            ipcRenderer.send('notify', 'All set! Focus time is on')
        },
        onPauseClick() {
            pause()
            ipcRenderer.send('notify', 'Notifications turned on')
            slack.endFocus()
        },
        onStopClick() {
            stop()
            ipcRenderer.send('notify', 'Notifications turned on')
            slack.endFocus()
        },
        onPomodoroBreak() {
            slack.endFocus()
            ipcRenderer.send('notify', 'Great job! Now take a break :)')
        },
        onTimerUpdate(timeLeft: number) {
            ipcRenderer.send('set-timer', timeLeft)
        }
        }
    }, [start, pause, stop])

    useEffect(() => {
        api.onTimerUpdate(timeLeft)
    }, [api, timeLeft])
    
    return api
}
