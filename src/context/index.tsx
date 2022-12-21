import * as React from 'react'
import {QueryClient, QueryClientProvider} from 'react-query'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthProvider} from 'context/auth-context'
import {getErrorStatus} from 'utils/error'

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

function AppProviders({children}: {children: React.ReactNode}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export {AppProviders}
