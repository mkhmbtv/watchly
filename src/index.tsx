import React from 'react'
import ReactDOM from 'react-dom/client'
import {QueryClient, QueryClientProvider} from 'react-query'
import './bootstrap'
import App from './app'
import {worker} from './mocks/server/dev-server'
import {getErrorStatus} from 'utils/error'

if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  worker.start({
    quiet: true,
    onUnhandledRequest: 'bypass',
  })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (getErrorStatus(error) === 404) return false
        else if (failureCount < 2) return true
        else return false
      },
    },
    mutations: {
      onError(error, variables, recover) {
        return typeof recover === 'function' ? recover() : null
      },
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
