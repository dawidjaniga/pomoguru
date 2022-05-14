import { PausePomodoroUseCase } from './domain/timer/useCase/PausePomodoro'
import { model } from './index'
import { useCallback, useEffect, useState } from 'react'
import { GetTimersUseCase } from './domain/timer/useCase/GetTimers'
import { StartPomodoroUseCase } from './domain/timer/useCase/StartPomodoro'
import { SkipPomodoroUseCase } from './domain/timer/useCase/SkipPomodoro'
import { SkipBreakUseCase } from './domain/timer/useCase/SkipBreak'

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

const useCasesMap = {
  'timer.startPomodoro': StartPomodoroUseCase,
  'timer.pausePomodoro': PausePomodoroUseCase,
  'timer.skipPomodoro': SkipPomodoroUseCase,
  'timer.skipBreak': SkipBreakUseCase,
  'timer.getTimers': GetTimersUseCase
}

type UseCases = keyof typeof useCasesMap

const useCaseCache = {}
// const useCaseCache: Record<UseCases, Function> = {}

export function getUseCase (useCase: UseCases) {
  // @ts-ignore
  if (!useCaseCache[useCase]) {
    // @ts-ignore
    useCaseCache[useCase] = new useCasesMap[useCase]()
  }

  // @ts-ignore
  return useCaseCache[useCase]
}

export function useCase (
  useCase: UseCases
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

    if (concreteUseCase.isReactive) {
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
