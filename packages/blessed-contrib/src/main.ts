import { NodeApplication } from '@pomoguru/node-application'
import { BlessedApp } from './app/BlessedApplication'

const nodeApp = new NodeApplication()
new BlessedApp(nodeApp)
