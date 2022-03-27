import { controller, model } from './index'
import { useEffect, useState } from 'react'

export const actions = {
  startWork () {
    controller.startWork()
  },
  pauseWork () {
    controller.pauseWork()
  },
  skipBreak () {
    controller.skipBreak()
  },
  cancelWork () {
    controller.cancelWork()
  }
}

export function useTimeLeft () {
  const [timeLeft, setTimeLeft] = useState(model.get('timeLeft'))

  useEffect(() => {
    model.subscribe('timeLeft:changed', value => {
      setTimeLeft(value)
    })
  }, [])

  return timeLeft
}

export function usePhase () {
  const [phase, setPhase] = useState(model.get('phase'))

  useEffect(() => {
    model.subscribe('phase:changed', (value: string) => {
      setPhase(value)
    })
  }, [])

  return phase
}

export function useUser () {
  const [user, setUser] = useState(model.get('user'))

  useEffect(() => {
    model.subscribe('user:changed', (value: unknown) => {
      setUser(value)
    })
  }, [])

  return user
}
