import {rest} from 'msw'
import * as moviesDB from '../data/moviesDB'

const apiUrl = process.env.REACT_APP_API_URL

const handlers = [
  rest.get(`${apiUrl}/movies`, async (req, res, ctx) => {
    const movies = moviesDB.getMovies()
    return res(ctx.json({movies}))
  }),
]

export {handlers}
