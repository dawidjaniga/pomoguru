import { getUseCase, model } from './index'
import { useCallback, useEffect, useState } from 'react'
import { UseCaseNames } from './core/useCasesMap'

export function useUser () {
  const [user, setUser] = useState(model.get('user'))

  useEffect(() => {
    model.subscribe('user:changed', (value: unknown) => {
      setUser(value)
    })
  }, [])

  return user
}

export function useNotificationsAllowed () {
  const [notificationsAllowed, setNotificationsAllowed] = useState(
    model.get('notificationsAllowed')
  )

  useEffect(() => {
    model.subscribe('notificationsAllowed:changed', (value: boolean) => {
      setNotificationsAllowed(value)
    })
  }, [])

  return notificationsAllowed
}

export function useCase (
  useCase: UseCaseNames
  // options?: typeof useCasesMap[typeof useCase]
) {
  const concreteUseCase = getUseCase(useCase)
  const [loaded, setIsLoaded] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const [data, setData] = useState<any>()
  // const [data, setData] = useState<Awaited<ReturnType<GetTimerOutput>>>()

  const getData = useCallback(async function () {
    const data = await concreteUseCase.execute()

    setData(data)
    setIsLoaded(true)
    // try {
    // } catch (e) {
    //   throw e
    //   if (e instanceof Error) {
    //     setError(e)
    //     setIsLoaded(true)
    //   }
    // }
  }, [])

  useEffect(() => {
    getData()

    // @ts-ignore
    if (concreteUseCase.isReactive) {
      // @ts-ignore
      concreteUseCase.subscribe('updated', () => {
        getData()
      })
    }
  }, [])
  // }, [JSON.stringify(options)])

  return {
    loaded,
    error,
    data
  }
}
