import { StoreActionApi, createHook, createStore } from 'react-sweet-state'
type State = { timeLeft: number; isActive: boolean }
type StoreApi = StoreActionApi<State>

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
      timerIntervalId = setInterval(() => {
        dispatch(actions.decrement())
      }, 1000)
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
      isActive: false
    })
  },
  setTimeLeft: (timeLeft: number) => ({ setState }: StoreApi) => {
    setState({
      timeLeft
    })
  }
}

const Store = createStore({
  initialState: {
    timeLeft: 0,
    isActive: false
  },
  actions,
  name: 'timeLefter'
})

export const useTimer = createHook(Store)
