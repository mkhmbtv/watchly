import {MockedRequest, RestHandler, DefaultBodyType} from 'msw'
import {rest} from 'msw'
import * as usersDB from '../data/users'
import * as moviesDB from '../data/movies'
import {HttpError} from '../error'
import {getErrorMessage} from 'utils/error'
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
    const user = await getUser(req)
    const token = getToken(req)
    return res(ctx.delay(delay), ctx.json({user: {...user, token}}))
  }),

  rest.get(`${apiUrl}/movies`, async (req, res, ctx) => {
    const query = req.url.searchParams.get('query')
    let matchingMovies = []
    if (query) {
      matchingMovies = await moviesDB.query(query)
    } else {
      const allMovies = moviesDB.getMovies()
      matchingMovies = allMovies.slice(0, 10)
    }
    return res(ctx.json({movies: matchingMovies}))
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
    userId = window.atob(token)
  } catch (e) {
    throw new HttpError(401, 'Invalid token. Please login again.')
  }
  const user = await usersDB.read(userId)
  return user
}

export {handlers}
