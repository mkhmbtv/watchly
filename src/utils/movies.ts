import * as React from 'react'
import {useQuery, useQueryClient} from 'react-query'
import {client} from './api-client'
import {AuthUser} from 'types/user'
import {Movie} from 'types/movies'
import moviePosterPlaceholerSvg from 'assets/movie-poster-placeholder.svg'

const loadingMovie = {
  title: 'Loading...',
  image: `${moviePosterPlaceholerSvg}`,
  description: '(...)',
  genres: 'Loading...',
  plot: 'Loading...',
  imDbRating: '0.0',
  imDbRatingVotes: '0',
  metacriticRating: '0',
  runtimeStr: 'Loading...',
  contentRating: 'G',
  stars: 'Loading...',
  starList: [{id: 'loading-id', name: '...'}],
  loadingMovie: true,
}

const loadingMovies = Array.from({length: 10}, (v, idx) => ({
  id: `loading-movie-${idx}`,
  ...loadingMovie,
}))

function useMovie(movieId: string, user: AuthUser): Movie {
  const {data} = useQuery({
    queryKey: ['movie', {movieId}],
    queryFn: () =>
      client<{movie: Movie}>(`movies/${movieId}`, {token: user.token}).then(
        data => data.movie,
      ),
  })
  return data ?? {...loadingMovie, id: 'loading-movie'}
}

const getMovieSearchConfig = (query: string, user: AuthUser) => ({
  queryKey: ['movieSearch', {query}],
  queryFn: () =>
    client<{movies: Movie[]}>(`movies?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.movies),
})

function useMovieSearch(query: string, user: AuthUser) {
  const result = useQuery(getMovieSearchConfig(query, user))
  return {...result, movies: result.data ?? loadingMovies}
}

function useRefetchMovieSearchQuery(user: AuthUser) {
  const queryClient = useQueryClient()
  return React.useCallback(async () => {
    queryClient.removeQueries('movieSearch')
    await queryClient.prefetchQuery(getMovieSearchConfig('', user))
  }, [queryClient, user])
}

export {useMovie, useMovieSearch, useRefetchMovieSearchQuery}
