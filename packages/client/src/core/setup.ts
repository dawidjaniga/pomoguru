import Container from 'typedi'

import { createUseCases } from './useCasesMap'
import setupDomains from '../core/setup/domains'

import { SocketIoRealTimeProvider } from '../SocketIoRealTimeProvider'
import { realTimeProviderToken, useCaseProviderToken } from './tokens'

function setup () {
  setupDependencies()
  setupDomains()
}

function setupDependencies () {
  Container.set(useCaseProviderToken, createUseCases())
  Container.set(realTimeProviderToken, new SocketIoRealTimeProvider())
}

setup()
