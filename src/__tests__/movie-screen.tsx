import * as React from 'react'
import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
  RenderOptions,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {buildUser, buildMovie} from 'mocks/build'
import * as usersDB from 'mocks/data/users'
import * as moviesDB from 'mocks/data/movies'
import * as session from 'services/session'
import {formatNumberString} from 'utils/misc'
import {AppProviders} from 'context'
import {App} from 'app'
import {AuthUser, UserCredentialsWithId} from 'types/user'

afterEach(async () => {
  await Promise.all([session.logout(), usersDB.reset(), moviesDB.reset()])
})

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

async function loginAsUser(userProperties?: UserCredentialsWithId) {
  const user = buildUser(userProperties)
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(session.localStorageKey, authUser.token)
  return authUser
}

type RenderConfig = {
  user?: AuthUser | null
  route?: string
} & RenderOptions

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

test('renders all the movie information', async () => {
  const movie = await moviesDB.create(buildMovie())
  const route = `/movie/${movie.id}`
  await render(<App />, {route})

  const title = `${movie.title} ${movie.description}`
  const director = movie.starList[0].name
  const stars = movie.starList
    .slice(1)
    .map(star => star.name)
    .join(', ')

  expect(screen.getByRole('heading', {name: title})).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /movie poster/i})).toHaveAttribute(
    'src',
    movie.image,
  )
  expect(screen.getByText(new RegExp(director, 'i'))).toBeInTheDocument()
  expect(screen.getByText(movie.contentRating)).toBeInTheDocument()
  expect(screen.getByText(movie.genres)).toBeInTheDocument()
  expect(screen.getByText(movie.runtimeStr)).toBeInTheDocument()
  expect(screen.getByText(movie.imDbRating)).toBeInTheDocument()
  expect(
    screen.getByText(
      new RegExp(formatNumberString(movie.imDbRatingVotes), 'i'),
    ),
  ).toBeInTheDocument()
  expect(screen.getByText(stars)).toBeInTheDocument()
  expect(screen.getByText(movie.plot)).toBeInTheDocument()
  expect(
    screen.getByRole('button', {name: /add to watchlist/i}),
  ).toBeInTheDocument()

  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as watched/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /unmark as watched/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as favorite/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /unmark as favorite/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /notes/i})).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
})

test('can create a log entry for the movie', async () => {
  const movie = await moviesDB.create(buildMovie())
  const route = `/movie/${movie.id}`
  await render(<App />, {route})

  const addToWatchlistButton = screen.getByRole('button', {
    name: /add to watchlist/i,
  })

  userEvent.click(addToWatchlistButton)
  expect(addToWatchlistButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(
    screen.getByRole('button', {name: /remove from list/i}),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', {name: /mark as watched/i}),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', {name: /mark as favorite/i}),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /notes/i})).toBeInTheDocument()

  expect(
    screen.queryByRole('button', {name: /add to watchlist/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /unmark as watched/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /unmark as favorite/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
})
