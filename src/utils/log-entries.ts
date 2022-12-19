import {useQuery, useMutation, useQueryClient} from 'react-query'
import {client} from './api-client'
import {setQueryDataForMovie} from './movies'
import {AuthUser} from 'types/user'
import {LogEntry, LogEntryWithMovie} from 'types/log-entry'

function useLogEntries(user: AuthUser) {
  const queryClient = useQueryClient()
  const {data} = useQuery({
    queryKey: 'log-entries',
    queryFn: () =>
      client<{logEntries: LogEntryWithMovie[]}>('log-entries', {
        token: user.token,
      }).then(data => data.logEntries),
    onSuccess(logEntries) {
      for (const logEntry of logEntries) {
        setQueryDataForMovie(queryClient, logEntry.movie)
      }
    },
  })

  return data ?? []
}

function useLogEntry(user: AuthUser, movieId: string) {
  const logEntries = useLogEntries(user)
  return logEntries.find(entry => entry.movieId === movieId) ?? null
}

function useCreateLogEntry(user: AuthUser) {
  const queryClient = useQueryClient()
  return useMutation(
    ({movieId}: {movieId: string}) => {
      return client('log-entries', {data: {movieId}, token: user.token})
    },
    {
      onSettled: () => queryClient.invalidateQueries('log-entries'),
    },
  )
}

function useUpdateLogEntry(user: AuthUser) {
  const queryClient = useQueryClient()
  return useMutation(
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
}

function useRemoveLogEntry(user: AuthUser) {
  const queryClient = useQueryClient()
  return useMutation(
    ({id}: {id: string}) => {
      return client(`log-entries/${id}`, {
        method: 'DELETE',
        token: user.token,
      })
    },
    {
      onSettled: () => queryClient.invalidateQueries('log-entries'),
    },
  )
}

export {
  useLogEntry,
  useLogEntries,
  useCreateLogEntry,
  useUpdateLogEntry,
  useRemoveLogEntry,
}
