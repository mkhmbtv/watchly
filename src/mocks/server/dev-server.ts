import {setupWorker} from 'msw'
import {handlers} from './server-handlers'

const worker = setupWorker(...handlers)

export * from 'msw'
export {worker}
