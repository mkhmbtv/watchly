import * as React from 'react'
import {QueryClient, QueryClientProvider as RQProvider} from 'react-query'
import {getErrorStatus} from 'utils/error'

const useConstant = (fn: () => QueryClient) => React.useState(fn)[0]

function QueryClientProvider({children}: {children: React.ReactNode}) {
  const queryClient = useConstant(
    () =>
      new QueryClient({
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
      }),
  )

  return <RQProvider client={queryClient}>{children}</RQProvider>
}

export {QueryClientProvider}
