import {useQuery, useMutation, useQueryClient, MutateOptions} from 'react-query'
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

function useCreateLogEntry(
  user: AuthUser,
  options?: MutateOptions<unknown, unknown, unknown, unknown>,
) {
  const queryClient = useQueryClient()
  return useMutation(
    ({movieId}: {movieId: string}) => {
      return client('log-entries', {data: {movieId}, token: user.token})
    },
    {
      onSettled: () => queryClient.invalidateQueries('log-entries'),
      ...options,
    },
  )
}

function useUpdateLogEntry(
  user: AuthUser,
  options?: MutateOptions<unknown, unknown, unknown, unknown>,
) {
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
      onMutate: async updatedLogEntry => {
        await queryClient.cancelQueries('log-entries')
        const prevLogEntries =
          queryClient.getQueryData<LogEntryWithMovie[]>('log-entries')

        if (prevLogEntries) {
          queryClient.setQueryData<LogEntryWithMovie[] | undefined>(
            'log-entries',
            old => {
              return old?.map(entry =>
                entry.id === updatedLogEntry.id
                  ? {...entry, ...updatedLogEntry}
                  : entry,
              )
            },
          )
        }

        return () => queryClient.setQueryData('log-entries', prevLogEntries)
      },
      onSettled: () => queryClient.invalidateQueries('log-entries'),
      ...options,
    },
  )
}

function useRemoveLogEntry(
  user: AuthUser,
  options?: MutateOptions<unknown, unknown, unknown, unknown>,
) {
  const queryClient = useQueryClient()
  return useMutation(
    ({id}: {id: string}) => {
      return client(`log-entries/${id}`, {
        method: 'DELETE',
        token: user.token,
      })
    },
    {
      onMutate: ({id}) => {
        const prevLogEntries =
          queryClient.getQueryData<LogEntryWithMovie[]>('log-entries')

        if (prevLogEntries) {
          queryClient.setQueryData<LogEntryWithMovie[] | undefined>(
            'log-entries',
            old => {
              return old?.filter(entry => entry.id !== id)
            },
          )
        }

        return () => queryClient.setQueryData('log-entries', prevLogEntries)
      },
      onSettled: () => queryClient.invalidateQueries('log-entries'),
      ...options,
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
