import * as React from 'react'
import {useParams} from 'react-router-dom'
import {client} from 'utils/api-client'
import {useAsync} from 'hooks/useAsync'
import {Movie} from 'types/movies'
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
  runtimeStr: 'Loading...',
  contentRating: 'G',
  starList: [{name: 'Loading...'}],
}

function MovieScreen({user}: {user: AuthUser}) {
  const {movieId} = useParams()
  const {data, run} = useAsync<{movie: Movie}>()

  React.useEffect(() => {
    run(client<{movie: Movie}>(`movies/${movieId}`, {token: user.token}))
  }, [movieId, run, user.token])

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
  } = data?.movie ?? loadingMovie

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
        <div className="leading-tight">
          <div className="text-4xl font-bold text-green-600">{imDbRating}</div>
          <small className="font-light">
            {Number(imDbRatingVotes).toLocaleString().replace(/,/g, ' ')} votes
          </small>
        </div>
      </div>
    </div>
  )
}

export {MovieScreen}
