import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {buildUser, buildMovie} from 'mocks/build'
import * as usersDB from 'mocks/data/users'
import * as moviesDB from 'mocks/data/movies'
import * as session from 'services/session'
import {formatNumberString} from 'utils/misc'
import {AppProviders} from 'context'
import {App} from 'app'

afterEach(async () => {
  await Promise.all([session.logout(), usersDB.reset(), moviesDB.reset()])
})

test('renders all the movie information', async () => {
  const user = buildUser()
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(session.localStorageKey, authUser.token)

  const movie = await moviesDB.create(buildMovie())
  const route = `/movie/${movie.id}`
  window.history.pushState({}, 'test page', route)

  render(<App />, {wrapper: AppProviders})

  await waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    {timeout: 7000},
  )

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
  const user = buildUser()
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(session.localStorageKey, authUser.token)

  const movie = await moviesDB.create(buildMovie())
  const route = `/movie/${movie.id}`
  window.history.pushState({}, 'test page', route)

  render(<App />, {wrapper: AppProviders})

  await waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    {timeout: 7000},
  )

  const addToWatchlistButton = screen.getByRole('button', {
    name: /add to watchlist/i,
  })

  userEvent.click(addToWatchlistButton)
  expect(addToWatchlistButton).toBeDisabled()

  await waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    {timeout: 7000},
  )

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
