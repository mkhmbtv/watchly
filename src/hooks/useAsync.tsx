import * as React from 'react'

function useSafeDispatch<DataType>(dispatch: (...args: DataType[]) => void) {
  const mounted = React.useRef(false)
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return React.useCallback(
    (...args: DataType[]) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch],
  )
}

type AsyncState<DataType> =
  | {
      status: 'idle'
      data?: null
      error?: null
    }
  | {
      status: 'pending'
      data?: null
      error?: null
    }
  | {
      status: 'resolved'
      data: DataType
      error: null
    }
  | {
      status: 'rejected'
      data: null
      error: Error
    }

type AsyncAction<DataType> =
  | {type: 'reset'}
  | {type: 'pending'}
  | {type: 'resolved'; data: DataType}
  | {type: 'rejected'; error: Error}

function asyncReducer<DataType>(
  state: AsyncState<DataType>,
  action: AsyncAction<DataType>,
): AsyncState<DataType> {
  switch (action.type) {
    case 'pending': {
      return {
        status: 'pending',
        data: null,
        error: null,
      }
    }
    case 'resolved': {
      return {
        status: 'resolved',
        data: action.data,
        error: null,
      }
    }
    case 'rejected': {
      return {
        status: 'rejected',
        error: action.error,
        data: null,
      }
    }
    case 'reset': {
      return {
        status: 'idle',
        data: null,
        error: null,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${JSON.stringify(action)}`)
    }
  }
}

function useAsync<DataType>(initialState?: AsyncState<DataType>) {
  const [state, unsafeDispatch] = React.useReducer<
    React.Reducer<AsyncState<DataType>, AsyncAction<DataType>>
  >(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const dispatch = useSafeDispatch(unsafeDispatch)

  const {status, data, error} = state
  const setData = React.useCallback(
    (data: DataType) => dispatch({type: 'resolved', data}),
    [dispatch],
  )

  const setError = React.useCallback(
    (error: Error) => dispatch({type: 'rejected', error}),
    [dispatch],
  )

  const reset = React.useCallback(() => dispatch({type: 'reset'}), [dispatch])

  const run = React.useCallback(
    (promise: Promise<DataType>) => {
      dispatch({type: 'pending'})
      return promise.then(
        data => {
          setData(data)
          return data
        },
        error => {
          setError(error)
          return Promise.reject(error)
        },
      )
    },
    [dispatch, setData, setError],
  )

  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isSuccess: status === 'resolved',
    isError: status === 'rejected',

    setData,
    setError,
    run,
    data,
    status,
    error,
    reset,
  }
}

export {useAsync}
