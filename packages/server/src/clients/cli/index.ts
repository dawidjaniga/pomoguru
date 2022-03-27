import 'setup'
const repl = require('repl')

import { StartWorkUseCase } from '../../useCases/startWork'

const replServer = repl.start({
  prompt: 'app > '
})

replServer.context.useCases = {
  StartWorkUseCase: new StartWorkUseCase()
}
