import {setupWorker} from 'msw'
import {handlers} from './server-handlers'

const server = setupWorker(...handlers)

server.start({
  quiet: true,
  onUnhandledRequest: 'bypass',
})

export * from 'msw'
export {server}
