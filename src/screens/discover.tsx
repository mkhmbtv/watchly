import * as React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input} from 'components/form-elements'
import {Spinner} from 'components/spinner'
import {Movie} from 'types/movies'
import {MovieRow} from 'components/movie-row'
import {client} from 'utils/api-client'
import {useAsync} from 'hooks/useAsync'

interface Movies {
  movies: Movie[]
}

function DiscoverMoviesScreen() {
  const {data, isLoading, isSuccess, isError, error, run} = useAsync<Movies>()
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState(false)

  React.useEffect(() => {
    run(client<Movies>(`movies?query=${encodeURIComponent(query)}`))
  }, [query, run])

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
