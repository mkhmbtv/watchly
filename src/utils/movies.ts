import * as React from 'react'
import {QueryClient, useQuery, useQueryClient} from 'react-query'
import {useAuth} from 'context/auth-context'
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

function useMovie(movieId: string): Movie {
  const {user} = useAuth()
  const {data} = useQuery({
    queryKey: ['movie', {movieId}],
    queryFn: () =>
      client<{movie: Movie}>(`movies/${movieId}`, {token: user?.token}).then(
        data => data.movie,
      ),
  })
  return data ?? {...loadingMovie, id: 'loading-movie'}
}

const getMovieSearchConfig = (
  query: string,
  user: AuthUser,
  queryClient: QueryClient,
) => ({
  queryKey: ['movieSearch', {query}],
  queryFn: () =>
    client<{movies: Movie[]}>(`movies?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.movies),
  onSuccess(movies: Movie[]) {
    for (const movie of movies) {
      setQueryDataForMovie(queryClient, movie)
    }
  },
})

function useMovieSearch(query: string) {
  const {user} = useAuth()
  const queryClient = useQueryClient()
  const result = useQuery(getMovieSearchConfig(query, user!, queryClient))
  return {...result, movies: result.data ?? loadingMovies}
}

function useRefetchMovieSearchQuery() {
  const {user} = useAuth()
  const queryClient = useQueryClient()
  return React.useCallback(async () => {
    queryClient.removeQueries('movieSearch')
    await queryClient.prefetchQuery(
      getMovieSearchConfig('', user!, queryClient),
    )
  }, [queryClient, user])
}

function setQueryDataForMovie(queryClient: QueryClient, movie: Movie) {
  return queryClient.setQueryData(['movie', {movieId: movie.id}], movie)
}

export {
  useMovie,
  useMovieSearch,
  useRefetchMovieSearchQuery,
  setQueryDataForMovie,
}
