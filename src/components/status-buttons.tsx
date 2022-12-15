import * as React from 'react'
import clsx from 'clsx'
import {useQuery, useMutation, useQueryClient} from 'react-query'
import Tooltip from '@reach/tooltip'
import {useAsync} from 'hooks/useAsync'
import {client} from 'utils/api-client'
import {AuthUser} from 'types/user'
import {Movie} from 'types/movies'
import {LogEntry} from 'types/log-entry'
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
  const {isLoading, isError, error, run} = useAsync()

  const handleClick = () => {
    run(onClick())
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
  user: AuthUser
  movie: Movie
}

function StatusButtons({user, movie}: StatusButtonsProps) {
  const logEntries = useQuery({
    queryKey: 'log-entries',
    queryFn: () =>
      client<{logEntries: LogEntry[]}>('log-entries', {token: user.token}).then(
        data => data.logEntries,
      ),
  })

  const logEntry =
    logEntries.data?.find(entry => entry.movieId === movie.id) ?? null

  const queryClient = useQueryClient()
  const {mutateAsync: create} = useMutation(
    ({movieId}: {movieId: string}) => {
      return client('log-entries', {data: {movieId}, token: user.token})
    },
    {
      onSettled: () => queryClient.invalidateQueries('log-entries'),
    },
  )

  const {mutateAsync: update} = useMutation(
    (updates: Partial<LogEntry>) => {
      return client(`log-entries/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      })
    },
    {
      onSettled: () => queryClient.invalidateQueries('log-entries'),
    },
  )

  const {mutateAsync: remove} = useMutation(
    ({id}: {id: string}) => {
      return client(`log-entries/${id}`, {method: 'DELETE', token: user.token})
    },
    {
      onSettled: () => queryClient.invalidateQueries('log-entries'),
    },
  )

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
          label="Remove from list"
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
