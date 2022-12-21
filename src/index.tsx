import React from 'react'
import ReactDOM from 'react-dom/client'
import {AppProviders} from './context'
import './bootstrap'
import App from './app'
import {worker} from './mocks/server/dev-server'

if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  worker.start({
    quiet: true,
    onUnhandledRequest: 'bypass',
  })
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <AppProviders>
    <App />
  </AppProviders>,
)
