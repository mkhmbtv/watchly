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
  highlight: string
}

const colorVariants = {
  green: 'hover:text-green-600 focus:text-green-600',
  red: 'hover:text-red-500 focus:text-red-500',
  orange: 'hover:text-orange-500 focus:text-orange-500',
  violet: 'hover:text-violet-500 focus:text-violet-500',
  blue: 'hover:text-blue-500 focus:text-blue-500',
  yellow: 'hover:text-yellow-500 focus:text-yellow-500',
}

function TooltipButton({
  label,
  onClick,
  icon,
  highlight,
  ...rest
}: TooltipButtonProps) {
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
        className={clsx(
          `bg-white`,
          colorVariants[highlight as keyof typeof colorVariants],
          {
            'hover:text-gray-500 focus:text-gray-500': isLoading,
            'hover:text-red-500 focus:text-red-500': isError,
          },
        )}
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
            highlight="orange"
          />
        ) : (
          <TooltipButton
            label="Mark as watched"
            onClick={() => update({id: logEntry.id, watchedDate: Date.now()})}
            icon={<FaEye />}
            highlight="green"
          />
        )
      ) : null}
      {logEntry ? (
        logEntry.favorite ? (
          <TooltipButton
            label="Unmark as favorite"
            onClick={() => update({id: logEntry.id, favorite: false})}
            icon={<FaHeartBroken />}
            highlight="violet"
          />
        ) : (
          <TooltipButton
            label="Mark as favorite"
            onClick={() => update({id: logEntry.id, favorite: true})}
            icon={<FaHeart />}
            highlight="red"
          />
        )
      ) : null}
      {logEntry ? (
        <TooltipButton
          label="Stop tracking"
          onClick={() => remove({id: logEntry.id})}
          icon={<FaMinusCircle />}
          highlight="yellow"
        />
      ) : (
        <TooltipButton
          label="Add to watchlist"
          onClick={() => create({movieId: movie.id})}
          icon={<FaPlusCircle />}
          highlight="blue"
        />
      )}
    </React.Fragment>
  )
}

export {StatusButtons}
