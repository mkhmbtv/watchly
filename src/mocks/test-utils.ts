import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
  RenderOptions,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {buildUser} from 'mocks/build'
import * as usersDB from 'mocks/data/users'
import * as session from 'services/session'
import {AppProviders} from 'context'
import {AuthUser, UserCredentialsWithId} from 'types/user'

async function waitForLoadingToFinish() {
  return waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    {
      timeout: 7000,
    },
  )
}

async function loginAsUser(userProperties?: Partial<UserCredentialsWithId>) {
  const user = buildUser(userProperties)
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(session.localStorageKey, authUser.token)
  return authUser
}

type RenderConfig = {
  user?: AuthUser | null
  route?: string
} & Omit<RenderOptions, 'wrapper'>

async function render(
  ui: React.ReactElement,
  {route = '/watchlist', user, ...renderOptions}: RenderConfig,
) {
  if (typeof user === 'undefined') {
    user = await loginAsUser()
  }

  window.history.pushState({}, 'test page', route)

  const utils = rtlRender(ui, {wrapper: AppProviders, ...renderOptions})
  await waitForLoadingToFinish()
  return {
    ...utils,
    user,
  }
}

export * from '@testing-library/react'
export {render, userEvent, loginAsUser, waitForLoadingToFinish}
