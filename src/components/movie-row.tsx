import * as React from 'react'
import {Movie} from 'types/movies'

interface Props {
  movie: Movie
}

function MovieRow({movie}: Props) {
  const {title, image, description, stars} = movie

  const id = `movie-row-movie-${movie.id}`

  return (
    <div className="flex items-center justify-end relative">
      <div
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
        <div className="flex-1">
          <div className="flex items-center">
            <h2 className="text-xl font-medium mr-1 text-gray-900">{title}</h2>
            <span className="font-thin">{description}</span>
          </div>
          <p className="mt-2 font-thin">{stars}</p>
        </div>
      </div>
    </div>
  )
}

export {MovieRow}
