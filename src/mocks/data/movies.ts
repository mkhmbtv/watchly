import moviesData from './movies.json'
import {matchSorter} from 'match-sorter'
import {Movie} from 'types/movies'

let movies: Movie[] = [...moviesData]

async function create(movie: Movie): Promise<Movie> {
  movies.push(movie)
  return movie
}

async function read(movieId: string): Promise<Movie | undefined> {
  return movies.find(movie => movie.id === movieId)
}

async function readManyNotLogged(ids: string[]): Promise<Movie[]> {
  return movies.filter(movie => !ids.includes(movie.id))
}

async function query(search: string) {
  return matchSorter(movies, search, {
    keys: ['title', {threshold: matchSorter.rankings.CONTAINS, key: 'plot'}],
  })
}

async function reset() {
  movies = [...moviesData]
}

export {create, read, readManyNotLogged, query, reset}
