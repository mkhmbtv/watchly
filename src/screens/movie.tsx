import * as React from 'react'
import {useParams} from 'react-router-dom'
import {StatusButtons} from 'components/status-buttons'
import {Rating} from 'components/rating'
import {useMovie} from 'utils/movies'
import {AuthUser} from 'types/user'
import {useLogEntry} from 'utils/log-entries'

function MovieScreen({user}: {user: AuthUser}) {
  const {movieId} = useParams() as {movieId: string}

  const logEntry = useLogEntry(user, movieId)
  const movie = useMovie(movieId, user)

  const {
    title,
    image,
    description,
    genres,
    plot,
    imDbRating,
    imDbRatingVotes,
    runtimeStr,
    contentRating,
    starList,
  } = movie

  return (
    <div>
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-8 sm:flex sm:flex-col">
        <img
          src={image}
          alt={`${title} movie poster`}
          className="w-full max-w-[14rem]"
        />
        <div className="text-gray-800">
          <div className="flex relative mb-4">
            <div className="flex-1 justify-between">
              <div className="mb-4">
                <h1 className="font-bold text-4xl">
                  {title} {description}
                </h1>
                <p className="font-thin">Directed by {starList[0].name}</p>
              </div>
              <div className="font-light text-gray-700">
                <span className="border-[1px] rounded-sm py-px px-1 mr-1.5 shadow-sm border-gray-500 text-gray-500">
                  {contentRating}
                </span>
                <span>{genres}</span>
                <span className="mx-1.5">|</span>
                <span>{runtimeStr}</span>
              </div>
            </div>
          </div>
          <p className="text-lg font-light">{plot}</p>
        </div>
        <div>
          <div className="leading-tight">
            <div className="text-4xl font-bold text-green-600">
              {imDbRating}
            </div>
            <small className="font-light">
              {Number(imDbRatingVotes).toLocaleString().replace(/,/g, ' ')}{' '}
              votes
            </small>
          </div>
          {movie.loadingMovie ? null : (
            <div className="flex gap-4 mt-5">
              <StatusButtons user={user} movie={movie} />
            </div>
          )}
          {logEntry?.watchedDate ? (
            <div className="mt-5">
              <Rating logEntry={logEntry} user={user} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export {MovieScreen}
