import * as React from 'react'
import clsx from 'clsx'
import Tooltip from '@reach/tooltip'
import {useAsync} from 'hooks/useAsync'
import {
  useLogEntry,
  useCreateLogEntry,
  useUpdateLogEntry,
  useRemoveLogEntry,
} from 'utils/log-entries'
import {Movie} from 'types/movie'
import {CircleButton} from './button'
import {Spinner} from './spinner'
import {
  FaEye,
  FaEyeSlash,
  FaHeart,
  FaHeartBroken,
  FaPlusCircle,
  FaMinusCircle,
  FaTimesCircle,
} from 'react-icons/fa'

type TooltipButtonProps = {
  label: string
  onClick: () => Promise<unknown>
  icon: React.ReactElement
}

function TooltipButton({label, onClick, icon, ...rest}: TooltipButtonProps) {
  const {isLoading, isError, error, run, reset} = useAsync()

  const handleClick = () => {
    if (isError) {
      reset()
    } else {
      run(onClick())
    }
  }

  return (
    <Tooltip label={isError ? error?.message : label}>
      <CircleButton
        className={clsx('bg-white hover:text-green-600 focus:text-green-600', {
          'hover:text-gray-500 focus:text-gray-500': isLoading,
          'hover:text-red-500 focus:text-red-500': isError,
        })}
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isError ? error?.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

interface StatusButtonsProps {
  movie: Movie
}

function StatusButtons({movie}: StatusButtonsProps) {
  const logEntry = useLogEntry(movie.id)

  const {mutateAsync: create} = useCreateLogEntry()
  const {mutateAsync: update} = useUpdateLogEntry()
  const {mutateAsync: remove} = useRemoveLogEntry()

  return (
    <React.Fragment>
      {logEntry ? (
        logEntry.watchedDate ? (
          <TooltipButton
            label="Unmark as watched"
            onClick={() => update({id: logEntry.id, watchedDate: null})}
            icon={<FaEyeSlash />}
          />
        ) : (
          <TooltipButton
            label="Mark as watched"
            onClick={() => update({id: logEntry.id, watchedDate: Date.now()})}
            icon={<FaEye />}
          />
        )
      ) : null}
      {logEntry ? (
        logEntry.favorite ? (
          <TooltipButton
            label="Unmark as favorite"
            onClick={() => update({id: logEntry.id, favorite: false})}
            icon={<FaHeartBroken />}
          />
        ) : (
          <TooltipButton
            label="Mark as favorite"
            onClick={() => update({id: logEntry.id, favorite: true})}
            icon={<FaHeart />}
          />
        )
      ) : null}
      {logEntry ? (
        <TooltipButton
          label="Stop tracking"
          onClick={() => remove({id: logEntry.id})}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to watchlist"
          onClick={() => create({movieId: movie.id})}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}

export {StatusButtons}
