import * as React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input} from 'components/form-elements'
import {Spinner} from 'components/spinner'
import {Movie} from 'types/movies'
import {MovieRow} from 'components/movie-row'
import {client} from 'utils/api-client'

interface Movies {
  movies: Movie[]
}

function DiscoverMoviesScreen() {
  const [status, setStatus] = React.useState('idle')
  const [data, setData] = React.useState<Movies | null>(null)
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isError = status === 'error'

  React.useEffect(() => {
    // if (!queried) return
    setStatus('loading')

    client<Movies>(`movies?query=${encodeURIComponent(query)}`).then(
      data => {
        setStatus('success')
        setData(data)
      },
      error => {
        setStatus('error')
        setError(error)
      },
    )
  }, [query])

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setQueried(true)
    const target = event.target as typeof event.target & {
      search: {value: string}
    }
    setQuery(target.search.value)
  }

  return (
    <div className="max-w-3xl m-auto py-10 w-[90vw]">
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
          <pre>{error?.message}</pre>
        </div>
      ) : null}
      {isSuccess ? (
        data?.movies?.length ? (
          <ul className="mt-5">
            {data?.movies?.map(movie => (
              <li key={movie.id} aria-label={movie.title}>
                <MovieRow movie={movie} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No movies found. Try another search</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverMoviesScreen}
