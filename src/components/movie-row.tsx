import * as React from 'react'
import {Link} from 'react-router-dom'
import {Rating} from './rating'
import {StatusButtons} from './status-buttons'
import {Movie} from 'types/movie'
import {useLogEntry} from 'utils/log-entries'
import {formatDate} from 'utils/misc'

interface Props {
  movie: Movie
}

function MovieRow({movie}: Props) {
  const {title, image, description, plot} = movie

  const logEntry = useLogEntry(movie.id)

  const id = `movie-row-movie-${movie.id}`

  return (
    <div className="flex items-center justify-end relative">
      <Link
        to={`/movie/${movie.id}`}
        aria-labelledby={id}
        className="grow-[2] border-b-[1px] py-4 border-solid border-gray-300 grid grid-cols-[128px_1fr] gap-5"
      >
        <div className="w-32 sm:w-28">
          <img
            src={image}
            alt={`${title}-movie-poster`}
            className="max-h-full w-full border-white border-4 border-solid hover:border-4 hover:border-solid hover:border-green-500"
          />
        </div>
        <div className="flex-1 text-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium ">
                {title}
                <span className="ml-1 text-base font-thin">{description}</span>
              </h2>
            </div>
            {logEntry?.watchedDate ? (
              <i className=" font-light">
                Watched {formatDate(logEntry.watchedDate)}
              </i>
            ) : null}
          </div>
          {logEntry?.watchedDate ? <Rating logEntry={logEntry} /> : null}
          <p className="mt-3 font-light">{plot}</p>
        </div>
      </Link>
      {!movie.loadingMovie ? (
        <div className="absolute left-36 bottom-5 flex gap-8 text-gray-500">
          <StatusButtons movie={movie} />
        </div>
      ) : null}
    </div>
  )
}

export {MovieRow}
