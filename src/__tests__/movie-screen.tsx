import * as React from 'react'
import {faker} from '@faker-js/faker'
import {server, rest} from 'mocks/server/test-server'
import {
  render,
  screen,
  userEvent,
  loginAsUser,
  waitForLoadingToFinish,
} from 'mocks/test-utils'
import {buildMovie, buildLogEntry} from 'mocks/build'
import * as session from 'services/session'
import * as moviesDB from 'mocks/data/movies'
import * as logEntriesDB from 'mocks/data/log-entries'
import {formatNumberString} from 'utils/misc'
import {App} from 'app'
import {AuthUser} from 'types/user'
import {Movie} from 'types/movies'
import {LogEntry} from 'types/log-entry'

const apiUrl = process.env.REACT_APP_API_URL

afterEach(async () => {
  await session.logout()
})

type RenderParams = {
  user?: AuthUser
  movie?: Movie
  logEntry?: LogEntry | null
}

async function renderMovieScreen({user, movie, logEntry}: RenderParams = {}) {
  if (typeof user === 'undefined') {
    user = await loginAsUser()
  }
  if (typeof movie === 'undefined') {
    movie = await moviesDB.create(buildMovie())
  }
  if (typeof logEntry === 'undefined') {
    logEntry = await logEntriesDB.create(buildLogEntry({user, movie}))
  }

  const route = `/movie/${movie.id}`
  const utils = await render(<App />, {route, user})

  return {
    ...utils,
    user,
    movie,
    logEntry,
  }
}

test('renders all the movie information', async () => {
  const {movie} = await renderMovieScreen({logEntry: null})

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
  await renderMovieScreen({logEntry: null})

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

test('can remove a log entry for the movie', async () => {
  await renderMovieScreen()

  const removeFromListButton = screen.getByRole('button', {
    name: /remove from list/i,
  })
  userEvent.click(removeFromListButton)
  expect(removeFromListButton).toBeDisabled()

  await waitForLoadingToFinish()

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

test('can mark a log entry as watched', async () => {
  const user = await loginAsUser()
  const movie = await moviesDB.create(buildMovie())
  const logEntry = await logEntriesDB.create(
    buildLogEntry({user, movie, watchedDate: null}),
  )
  await renderMovieScreen({user, movie, logEntry})

  const markAsWatchedButton = screen.getByRole('button', {
    name: 'Mark as watched',
  })
  userEvent.click(markAsWatchedButton)
  expect(markAsWatchedButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(
    screen.getByRole('button', {name: /unmark as watched/i}),
  ).toBeInTheDocument()
  expect(screen.queryAllByRole('radio', {name: /star/i})).toHaveLength(5)

  expect(
    screen.queryByRole('button', {name: 'Mark as watched'}),
  ).not.toBeInTheDocument()
  expect(await logEntriesDB.read(logEntry.id).watchedDate).not.toBeNull()
})

test('can mark a log entry as favorite', async () => {
  const user = await loginAsUser()
  const movie = await moviesDB.create(buildMovie())
  const logEntry = await logEntriesDB.create(
    buildLogEntry({user, movie, favorite: false}),
  )
  await renderMovieScreen({user, movie, logEntry})

  const markAsFavoriteButton = screen.getByRole('button', {
    name: 'Mark as favorite',
  })
  userEvent.click(markAsFavoriteButton)
  expect(markAsFavoriteButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(
    screen.getByRole('button', {name: /unmark as favorite/i}),
  ).toBeInTheDocument()
  expect(await logEntriesDB.read(logEntry.id)).toMatchObject({
    favorite: true,
  })

  expect(
    screen.queryByRole('button', {name: 'Mark as favorite'}),
  ).not.toBeInTheDocument()
})

test('can edit a note', async () => {
  jest.useFakeTimers()

  const {logEntry} = await renderMovieScreen()

  const openNotesModalButton = screen.getByRole('button', {name: /notes/i})
  userEvent.click(openNotesModalButton)

  const newNotes = faker.lorem.words()
  const notesTextarea = screen.getByRole('textbox', {
    name: /add your personal notes/i,
  })

  userEvent.clear(notesTextarea)
  userEvent.type(notesTextarea, newNotes)

  await screen.findByLabelText(/loading/i)

  await waitForLoadingToFinish()

  expect(notesTextarea).toHaveValue(newNotes)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(await logEntriesDB.read(logEntry!.id)).toMatchObject({
    notes: newNotes,
  })
})

describe('console errors', () => {
  let consoleSpy: jest.SpyInstance
  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      //
    })
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  test('shows an error message when a movie fails to load', async () => {
    const movie = buildMovie({id: 'BAD_ID'})

    await renderMovieScreen({movie, logEntry: null})

    expect(
      (await screen.findByRole('alert')).textContent,
    ).toMatchInlineSnapshot(`"There was an error:Movie not found"`)
    expect(consoleSpy).toHaveBeenCalled()
  })

  test('note update failures are displayed', async () => {
    jest.useFakeTimers()
    const testErrorMessage = 'test error message'

    await renderMovieScreen()

    server.use(
      rest.put(`${apiUrl}/log-entries/:logEntryId`, async (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({status: 400, message: testErrorMessage}),
        )
      }),
    )

    const openNotesModalButton = screen.getByRole('button', {name: /notes/i})
    userEvent.click(openNotesModalButton)

    const newNotes = faker.lorem.words()
    const notesTextarea = screen.getByRole('textbox', {
      name: /add your personal notes/i,
    })

    userEvent.clear(notesTextarea)
    userEvent.type(notesTextarea, newNotes)

    await screen.findByLabelText(/loading/i)

    await waitForLoadingToFinish()

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"There was an error:test error message"`,
    )
  })
})
