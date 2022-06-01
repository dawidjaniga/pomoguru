import { app } from './../app'
import { useEffect, useState } from 'react'
import { GetTimerOutput, GetUserOutput } from '@pomoguru/client'

export function useTimers () {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState<GetTimerOutput>()
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoaded(true)
    try {
      const unsubscribe = app.subscribeToGetTimers(data => {
        setData(data)
      })

      return unsubscribe
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
  }, [])

  return { loaded, error, data }
}

export function useUser () {
  const [loaded, setLoaded] = useState(false)
  // @TODO: #improvement Get initial state from use case. SSR breaks when
  // there is null returned
  const [data, setData] = useState<GetUserOutput>({
    authenticated: false,
    id: '',
    email: '',
    avatarUrl: ''
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoaded(true)
    try {
      const unsubscribe = app.subscribeToGetUser(data => {
        setData(data)
      })
      return unsubscribe
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
  }, [])

  return { loaded, error, data }
}
