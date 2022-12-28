import {MockedRequest, RestHandler, DefaultBodyType} from 'msw'
import {rest} from 'msw'
import {Buffer} from 'buffer'
import * as usersDB from '../data/users'
import * as moviesDB from '../data/movies'
import * as logEntriesDB from '../data/log-entries'
import {HttpError} from '../error'
import {getErrorMessage, getErrorStatus} from 'utils/error'
import {UserFormData} from 'types/user'

const apiUrl = process.env.REACT_APP_API_URL
const delay = process.env.NODE_ENV === 'test' ? 0 : 1500

const handlers: Array<RestHandler<MockedRequest<DefaultBodyType>>> = [
  rest.post(`${apiUrl}/login`, async (req, res, ctx) => {
    const {username, password} = await req.json()
    const userFields: UserFormData = {username, password}
    let user
    try {
      user = await usersDB.authenticate(userFields)
    } catch (error) {
      return res(
        ctx.delay(delay),
        ctx.status(400),
        ctx.json({status: 400, message: getErrorMessage(error)}),
      )
    }
    return res(ctx.delay(delay), ctx.json({user}))
  }),

  rest.post(`${apiUrl}/register`, async (req, res, ctx) => {
    const {username, password} = await req.json()
    const userFields: UserFormData = {username, password}
    await usersDB.create(userFields)
    let user
    try {
      user = await usersDB.authenticate(userFields)
    } catch (error) {
      return res(
        ctx.delay(delay),
        ctx.status(400),
        ctx.json({status: 400, message: getErrorMessage(error)}),
      )
    }
    return res(ctx.delay(delay), ctx.json({user}))
  }),

  rest.get(`${apiUrl}/me`, async (req, res, ctx) => {
    let user
    try {
      user = await getUser(req)
    } catch (error) {
      return res(
        ctx.delay(delay),
        ctx.status(401),
        ctx.json({status: 401, message: getErrorMessage(error)}),
      )
    }
    const token = getToken(req)
    return res(ctx.delay(delay), ctx.json({user: {...user, token}}))
  }),

  rest.get(`${apiUrl}/bootstrap`, async (req, res, ctx) => {
    try {
      const user = await getUser(req)
      const token = getToken(req)
      const logEntries = await logEntriesDB.readByUser(user.id)
      const logEntriesAndMovies = await Promise.all(
        logEntries.map(async logEntry => ({
          ...logEntry,
          movie: await moviesDB.read(logEntry.movieId),
        })),
      )
      return res(
        ctx.delay(delay),
        ctx.json({user: {...user, token}, logEntries: logEntriesAndMovies}),
      )
    } catch (error) {
      const status = getErrorStatus(error)
      return res(
        ctx.delay(delay),
        ctx.status(status),
        ctx.json({status, message: getErrorMessage(error)}),
      )
    }
  }),

  rest.get(`${apiUrl}/movies`, async (req, res, ctx) => {
    const query = req.url.searchParams.get('query')
    let matchingMovies = []

    if (query) {
      matchingMovies = await moviesDB.query(query)
    } else {
      const token = getToken(req)
      if (token) {
        const user = await getUser(req)
        const allMovies = await getMoviesNotLoggedByUser(user.id)
        matchingMovies = allMovies.slice(0, 10)
      } else {
        const allMovies = await moviesDB.readManyNotLogged([])
        matchingMovies = allMovies.slice(0, 10)
      }
    }
    return res(ctx.delay(delay), ctx.json({movies: matchingMovies}))
  }),

  rest.get(`${apiUrl}/movies/:movieId`, async (req, res, ctx) => {
    const {movieId} = req.params
    const movie = await moviesDB.read(movieId as string)
    if (!movie) {
      return res(
        ctx.delay(delay),
        ctx.status(404),
        ctx.json({status: 404, message: 'Movie not found'}),
      )
    }
    return res(ctx.delay(delay), ctx.json({movie}))
  }),

  rest.get(`${apiUrl}/log-entries`, async (req, res, ctx) => {
    const user = await getUser(req)
    const logEntries = await logEntriesDB.readByUser(user.id)
    const logEntriesAndMovies = await Promise.all(
      logEntries.map(async logEntry => ({
        ...logEntry,
        movie: await moviesDB.read(logEntry.movieId),
      })),
    )
    return res(ctx.json({logEntries: logEntriesAndMovies}))
  }),

  rest.post(`${apiUrl}/log-entries`, async (req, res, ctx) => {
    try {
      const {movieId} = (await req.json()) as {movieId: string}
      const user = await getUser(req)
      const logEntry = await logEntriesDB.create({
        movieId,
        userId: user.id,
      })
      const movie = await moviesDB.read(movieId)
      return res(ctx.delay(delay), ctx.json({logEntry: {...logEntry, movie}}))
    } catch (error) {
      const status = getErrorStatus(error)
      return res(
        ctx.delay(delay),
        ctx.status(status),
        ctx.json({status, message: getErrorMessage(error)}),
      )
    }
  }),

  rest.put(`${apiUrl}/log-entries/:logEntryId`, async (req, res, ctx) => {
    try {
      const {logEntryId} = req.params as {logEntryId: string}
      const user = await getUser(req)
      const updates = await req.json()
      await logEntriesDB.authorize(user.id, logEntryId)
      const updatedLogEntry = await logEntriesDB.update(logEntryId, updates)
      const movie = await moviesDB.read(updatedLogEntry.movieId)
      return res(
        ctx.delay(delay),
        ctx.json({logEntry: {...updatedLogEntry, movie}}),
      )
    } catch (error) {
      const status = getErrorStatus(error)
      return res(
        ctx.delay(delay),
        ctx.status(status),
        ctx.json({status, message: getErrorMessage(error)}),
      )
    }
  }),

  rest.delete(`${apiUrl}/log-entries/:logEntryId`, async (req, res, ctx) => {
    try {
      const user = await getUser(req)
      const {logEntryId} = req.params as {logEntryId: string}
      await logEntriesDB.authorize(user.id, logEntryId)
      await logEntriesDB.remove(logEntryId)
      return res(ctx.json({success: true}))
    } catch (error) {
      const status = getErrorStatus(error)
      return res(
        ctx.delay(delay),
        ctx.status(status),
        ctx.json({status, message: getErrorMessage(error)}),
      )
    }
  }),
]

const getToken = (req: MockedRequest) =>
  req.headers.get('Authorization')?.replace('Bearer ', '')

async function getUser(req: MockedRequest) {
  const token = getToken(req)

  if (!token) {
    throw new HttpError(401, 'A token must be provided')
  }
  let userId
  try {
    userId = Buffer.from(token, 'base64').toString('binary')
  } catch (e) {
    throw new HttpError(401, 'Invalid token. Please login again.')
  }
  const user = await usersDB.read(userId)
  return user
}

async function getMoviesNotLoggedByUser(userId: string) {
  const usersMovieIds = (await logEntriesDB.readByUser(userId)).map(
    log => log.movieId,
  )
  const movies = await moviesDB.readManyNotLogged(usersMovieIds)
  return movies
}

export {handlers}
