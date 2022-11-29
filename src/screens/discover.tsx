import * as React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch} from 'react-icons/fa'
import {Input} from 'components/form-elements'
import {Spinner} from 'components/spinner'
import {Movie} from 'types/movies'
import {MovieRow} from 'components/movie-row'

function DiscoverMoviesScreen() {
  const [status, setStatus] = React.useState('idle')
  const [data, setData] = React.useState<{movies: Movie[]} | null>(null)
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState(false)

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  React.useEffect(() => {
    // if (!queried) return
    setStatus('loading')
    window
      .fetch(
        `${process.env.REACT_APP_API_URL}/movies?query=${encodeURIComponent(
          query,
        )}`,
      )
      .then(res => res.json())
      .then(data => {
        setData(data)
        setStatus('success')
      })
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
              {isLoading ? <Spinner /> : <FaSearch aria-label="search" />}
            </button>
          </label>
        </Tooltip>
      </form>
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
