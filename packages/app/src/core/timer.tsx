import { StoreActionApi, createHook, createStore } from 'react-sweet-state'
import { Phase } from 'types/timer'
type State = { timeLeft: number; isActive: boolean; phase: Phase }
type StoreApi = StoreActionApi<State>

const intervalInMs = 1000
let timerIntervalId = 0

const actions = {
  decrement: () => ({ setState, getState }: StoreApi) => {
    const timeLeft = getState().timeLeft - 1
    setState({
      timeLeft
    })
  },
  start: () => ({ setState, dispatch }: StoreApi) => {
    setState({
      isActive: true
    })

    if (!timerIntervalId) {
      timerIntervalId = window.setInterval(() => {
        dispatch(actions.decrement())
      }, intervalInMs)
    }
  },
  pause: () => ({ setState }: StoreApi) => {
    clearInterval(timerIntervalId)
    timerIntervalId = 0

    setState({
      isActive: false
    })
  },
  stop: () => ({ setState }: StoreApi) => {
    clearInterval(timerIntervalId)
    timerIntervalId = 0
    setState({
      isActive: false,
      timeLeft: 0
    })
  },
  setTimeLeft: (timeLeft: number) => ({ setState }: StoreApi) => {
    setState({
      timeLeft
    })
  },
  setPhase: (phase: Phase) => ({ setState }: StoreApi) => {
    setState({
      phase
    })
  }
}

const Store = createStore({
  initialState: {
    timeLeft: 0,
    isActive: false,
    phase: Phase.idle
  },
  actions,
  name: 'timeLefter'
})

export const useTimer = createHook(Store)
