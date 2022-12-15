import React from 'react'
import ReactDOM from 'react-dom/client'
import {QueryClient, QueryClientProvider} from 'react-query'
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

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
