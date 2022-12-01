import {MockedRequest, RestHandler, DefaultBodyType} from 'msw'
import {rest} from 'msw'
import * as usersDB from '../data/users'
import * as moviesDB from '../data/movies'
import {getErrorMessage} from 'utils/error'

const apiUrl = process.env.REACT_APP_API_URL

const handlers: Array<RestHandler<MockedRequest<DefaultBodyType>>> = [
  rest.post(`${apiUrl}/login`, async (req, res, ctx) => {
    const {username, password} = await req.json()
    const user = await usersDB.authenticate({username, password})
    return res(ctx.json({user}))
  }),
  rest.post(`${apiUrl}/register`, async (req, res, ctx) => {
    const {username, password} = await req.json()
    const userFields = {username, password}
    await usersDB.create(userFields)
    let user
    try {
      user = await usersDB.authenticate(userFields)
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({status: 400, message: getErrorMessage(error)}),
      )
    }
    return res(ctx.json({user}))
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

export {handlers}
