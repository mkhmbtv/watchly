import {rest} from 'msw'
import * as moviesDB from '../data/moviesDB'

const apiUrl = process.env.REACT_APP_API_URL

const handlers = [
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
