import moviesData from './movies.json'
import {matchSorter} from 'match-sorter'
import {Movie} from 'types/movies'

const movies: Movie[] = [...moviesData]

function getMovies() {
  return movies
}

async function read(movieId: string): Promise<Movie | undefined> {
  return movies.find(movie => movie.id === movieId)
}

async function query(search: string) {
  return matchSorter(movies, search, {
    keys: ['title', {threshold: matchSorter.rankings.CONTAINS, key: 'plot'}],
  })
}

export {getMovies, read, query}
