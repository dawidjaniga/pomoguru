import Interval from './interval'
import Timer from './timer'
import { Model, TimeLeft } from './objects/model'
import { SocketIoRealTimeProvider } from './SocketIoRealTimeProvider'
import { MainController } from './mainController'

export const controller = new MainController(
  new Interval(),
  new Timer(),
  new Model(),
  new SocketIoRealTimeProvider()
)

export const model = controller.model

export { TimeLeft }
