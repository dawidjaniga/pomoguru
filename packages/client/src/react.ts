import { useCaseProvider, UseCaseNames, model } from './index'
import { useCallback, useEffect, useState } from 'react'
import { Publisher } from './objects/publisher'
import { UseCaseInput, UseCaseOutput } from './core/useCasesMap'

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

export function useCase<Name extends UseCaseNames> (
  useCase: Name,
  options?: UseCaseInput<Name>
  // @Improvement: Allow useCase to pass options with correct type
) {
  const concreteUseCase = useCaseProvider.get(useCase)
  const [loaded, setIsLoaded] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const [data, setData] = useState<UseCaseOutput<Name>>()
  // @TODO: #improvement
  // Return correct Output type
  // const [data, setData] = useState<
  //   Awaited<ReturnType<typeof concreteUseCase['execute']>>
  // >()

  const getData = useCallback(async function () {
    /*
    @TODO: #improvement
    Allow to pass options to UseCase. Altering behavior while executing or by setters?
    */

    const data = await concreteUseCase.execute()

    // @ts-ignore
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

    if (concreteUseCase instanceof Publisher) {
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
