import { useEffect } from 'react';
import { useTimer } from './timer';
const { ipcRenderer } = window.require("electron");


export function useMediator() {
    const [{ timeLeft }, { start, pause, stop }] = useTimer()

    const api = {
        onStartClick() {
            start()
        },
        onPauseClick() {
            pause()
        },
        onStopClick() {
            stop()
        },
        onTimerUpdate(timeLeft: number) {
            ipcRenderer.send('set-timer', timeLeft)
        }

    }

    useEffect(() => {
        api.onTimerUpdate(timeLeft)
    }, [timeLeft])
    
    return api
}
