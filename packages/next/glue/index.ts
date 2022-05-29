import { app } from './../app'
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { GetTimerOutput, GetUserOutput } from '@pomoguru/client'

export function useNotificationsAllowed () {
  //   const [notificationsAllowed, setNotificationsAllowed] = useState(
  //     model.get('notificationsAllowed')
  //   )
  //   useEffect(() => {
  //     model.subscribe('notificationsAllowed:changed', (value: boolean) => {
  //       // @ts-ignore
  //       setNotificationsAllowed(value)
  //     })
  //   }, [])
  //   return notificationsAllowed
}

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
  //   const result = useReactQuerySubscription(
  //     'getTimers',
  //     app.subscribeToGetTimers
  //   )

  //   return result
}

export function useUser () {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState<GetUserOutput>()
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoaded(true)
    try {
      const unsubscribe = app.subscribeToGetUser(data => {
        console.log('user user glue', data)
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

function useReactQuerySubscription (subscriptionKey: string, subscribe) {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState()
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoaded(true)
    try {
      const unsubscribe = subscribe(data => {
        setData(data)
      })
      return unsubscribe
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
  }, [subscribe])

  return { loaded, error, data }
}
// function useReactQuerySubscription (subscriptionKey: string, subscribe) {
//   const result = useQuery(
//     subscriptionKey,
//     () =>
//       new Promise(resolve => {
//         resolve({ data: true })
//         // subscribe(data => resolve(data))
//       })
//   )

//   const queryClient = useQueryClient()

//   useEffect(() => {
//     const unsubscribe = subscribe(data => {
//       queryClient.invalidateQueries(subscriptionKey)
//     })

//     return unsubscribe
//   }, [queryClient, subscribe, subscriptionKey])

//   return result
// }
