import moviesData from './movies.json'
import {matchSorter} from 'match-sorter'

const movies = [...moviesData]

function getMovies() {
  return movies
}

async function read(movieId: string) {
  return movies.find(movie => movie.id === movieId)
}

async function query(search: string) {
  return matchSorter(movies, search, {
    keys: ['title', {threshold: matchSorter.rankings.CONTAINS, key: 'plot'}],
  })
}

export {getMovies, read, query}
