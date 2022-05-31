import Timer from '../../../valueObjects/timer'
import { SocketIoRealTimeProvider } from '../../../SocketIoRealTimeProvider'
import { StartPomodoroUseCase } from './StartPomodoro'

describe('Start Pomodoro Use Case', () => {
  it('should start pomodoro', () => {
    const realTimeProvider = (<unknown>{
      startPomodoro: jest.fn()
    }) as SocketIoRealTimeProvider
    const pomodoro = (<unknown>{
      start: jest.fn()
    }) as Timer
    const useCase = new StartPomodoroUseCase(realTimeProvider, pomodoro)

    useCase.execute()
  })
})
