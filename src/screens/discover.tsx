import * as React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input} from 'components/form-elements'
import {Spinner} from 'components/spinner'
import {Movie} from 'types/movies'
import {MovieRow} from 'components/movie-row'
import {client} from 'utils/api-client'
import {getErrorMessage} from 'utils/error'
import {useQuery} from 'react-query'
import {AuthUser} from 'types/user'
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
  starList: [{id: '0', name: '...'}],
  loadingMovie: true,
}

const loadingMovies = Array.from({length: 10}, (v, idx) => ({
  id: `loading-book-${idx}`,
  ...loadingMovie,
}))

function DiscoverMoviesScreen({user}: {user: AuthUser}) {
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState(false)

  const {
    data: movies = loadingMovies,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ['movieSearch', {query}],
    queryFn: () =>
      client<{movies: Movie[]}>(`movies?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.movies),
  })

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setQueried(true)
    const target = event.target as typeof event.target & {
      search: {value: string}
    }
    setQuery(target.search.value)
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <Input placeholder="Search movies" id="search" className="w-full" />
        <Tooltip label="Search movies">
          <label htmlFor="search">
            <button
              type="submit"
              className="relative -ml-9 border-0 bg-transparent"
            >
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FaTimes aria-label="error" className="text-red-500" />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>
      {isError ? (
        <div className="text-red-500">
          <p>There was an error:</p>
          <pre>{getErrorMessage(error)}</pre>
        </div>
      ) : null}
      <div>
        {queried ? null : (
          <div className="mt-5 text-lg text-center font-light leading-8">
            <p>Welcome to the discover page.</p>
            <p>Here&apos;s what we&apos;ve been watching... </p>
            {isLoading ? (
              <div className="w-full m-auto">
                <Spinner />
              </div>
            ) : isSuccess && movies.length ? (
              <p>Here you go! Find more movies with the search bar above.</p>
            ) : isSuccess && !movies.length ? (
              <p>Sorry, we couldn&apos;t find any movies for you...</p>
            ) : null}
          </div>
        )}
      </div>
      {movies.length ? (
        <ul className="mt-5">
          {movies?.map(movie => (
            <li key={movie.id} aria-label={movie.title}>
              <MovieRow movie={movie} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No movies found. Try another search</p>
      )}
    </div>
  )
}

export {DiscoverMoviesScreen}
