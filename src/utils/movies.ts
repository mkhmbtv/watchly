import * as React from 'react'
import {QueryClient, useQuery, useQueryClient} from 'react-query'
import {useClient} from 'context/auth-context'
import {client as apiClient} from './api-client'
import {Movie} from 'types/movie'
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

function useMovie(movieId: string) {
  const client = useClient<{movie: Movie}>()
  const {data} = useQuery({
    queryKey: ['movie', {movieId}],
    queryFn: () => client(`movies/${movieId}`).then(data => data?.movie),
  })
  return data ?? {...loadingMovie, id: 'loading-movie'}
}

const getMovieSearchConfig = (
  query: string,
  client: typeof apiClient<{movies: Movie[]}>,
  queryClient: QueryClient,
) => ({
  queryKey: ['movieSearch', {query}],
  queryFn: () =>
    client(`movies?query=${encodeURIComponent(query)}`).then(
      data => data.movies,
    ),
  onSuccess(movies: Movie[]) {
    for (const movie of movies) {
      setQueryDataForMovie(queryClient, movie)
    }
  },
})

function useMovieSearch(query: string) {
  const client = useClient<{movies: Movie[]}>()
  const queryClient = useQueryClient()
  const result = useQuery(getMovieSearchConfig(query, client, queryClient))
  return {...result, movies: result.data ?? loadingMovies}
}

function useRefetchMovieSearchQuery() {
  const client = useClient<{movies: Movie[]}>()
  const queryClient = useQueryClient()
  return React.useCallback(async () => {
    queryClient.removeQueries('movieSearch')
    await queryClient.prefetchQuery(
      getMovieSearchConfig('', client, queryClient),
    )
  }, [client, queryClient])
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
