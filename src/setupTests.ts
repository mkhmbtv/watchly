import {server} from 'mocks/server/test-server'
import '@testing-library/jest-dom'
import {act} from '@testing-library/react'
import * as usersDB from 'mocks/data/users'
import * as moviesDB from 'mocks/data/movies'
import * as logEntriesDB from 'mocks/data/log-entries'

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

afterEach(async () => {
  await Promise.all([usersDB.reset(), moviesDB.reset(), logEntriesDB.reset()])
})

afterEach(async () => {
  if (jest.isMockFunction(setTimeout)) {
    act(() => jest.runOnlyPendingTimers())
    jest.useRealTimers()
  }
})
