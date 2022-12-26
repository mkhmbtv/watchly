import {renderHook, act} from '@testing-library/react'
import {useAsync} from '../useAsync'

let spy: jest.SpyInstance

beforeEach(() => {
  spy = jest.spyOn(console, 'error')
})

afterEach(() => {
  spy.mockRestore()
})

function deferred() {
  let resolve: ((value: unknown) => void) | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let reject: ((reason?: any) => void) | undefined
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual({
    status: 'idle',
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  let p: Promise<unknown>
  act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual({
    status: 'pending',
    isIdle: false,
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  const resolvedValue = Symbol('resolved value')
  await act(async () => {
    resolve?.(resolvedValue)
    await p
  })

  expect(result.current).toEqual({
    status: 'resolved',
    isIdle: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: resolvedValue,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual({
    status: 'idle',
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual({
    status: 'idle',
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  let p: Promise<unknown>
  act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual({
    status: 'pending',
    isIdle: false,
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  const rejectedValue = Symbol('rejected value')
  await act(async () => {
    reject?.(rejectedValue)
    await p.catch(() => {
      // Catching
    })
  })

  expect(result.current).toEqual({
    status: 'rejected',
    isIdle: false,
    isLoading: false,
    isSuccess: false,
    isError: true,
    error: rejectedValue,
    data: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual({
    status: 'idle',
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('can specify an initial state', async () => {
  const mockData = Symbol('resolved value')
  const initialState = {status: 'resolved' as const, data: mockData}
  const {result} = renderHook(() => useAsync(initialState))
  expect(result.current).toEqual({
    status: 'resolved',
    isIdle: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: mockData,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('can set the data', async () => {
  const {result} = renderHook(() => useAsync())

  const mockData = Symbol('resolved value')
  act(() => {
    result.current.setData(mockData)
  })

  expect(result.current).toEqual({
    status: 'resolved',
    isIdle: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: mockData,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('can set the error', async () => {
  const {result} = renderHook(() => useAsync())

  const mockError = new Error('rejected value')
  act(() => {
    result.current.setError(mockError)
  })

  expect(result.current).toEqual({
    status: 'rejected',
    isIdle: false,
    isLoading: false,
    isSuccess: false,
    isError: true,
    error: mockError,
    data: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })
})

test('No state updates happen if the component is unmounted while pending', async () => {
  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())

  let p: Promise<unknown>
  act(() => {
    p = result.current.run(promise)
  })

  unmount()

  const resolvedValue = Symbol('resolved value')
  await act(async () => {
    resolve?.(resolvedValue)
    await p
  })

  expect(result.current).toEqual({
    status: 'pending',
    isIdle: false,
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,

    setData: expect.any(Function),
    setError: expect.any(Function),
    run: expect.any(Function),
    reset: expect.any(Function),
  })

  expect(console.error).not.toHaveBeenCalled()
})
