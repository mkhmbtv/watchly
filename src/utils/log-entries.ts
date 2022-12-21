import {useQuery, useMutation, useQueryClient, MutateOptions} from 'react-query'
import {useClient} from 'context/auth-context'
import {setQueryDataForMovie} from './movies'
import {LogEntry, LogEntryWithMovie} from 'types/log-entry'

function useLogEntries() {
  const client = useClient<{logEntries: LogEntryWithMovie[]}>()
  const queryClient = useQueryClient()
  const {data} = useQuery({
    queryKey: 'log-entries',
    queryFn: () => client('log-entries').then(data => data.logEntries),
    onSuccess(logEntries) {
      for (const logEntry of logEntries) {
        setQueryDataForMovie(queryClient, logEntry.movie)
      }
    },
  })

  return data ?? []
}

function useLogEntry(movieId: string) {
  const logEntries = useLogEntries()
  return logEntries.find(entry => entry.movieId === movieId) ?? null
}

function useCreateLogEntry(
  options?: MutateOptions<unknown, unknown, unknown, unknown>,
) {
  const client = useClient()
  const queryClient = useQueryClient()
  return useMutation(
    ({movieId}: {movieId: string}) => {
      return client('log-entries', {data: {movieId}})
    },
    {
      onSettled: () => queryClient.invalidateQueries('log-entries'),
      ...options,
    },
  )
}

function useUpdateLogEntry(
  options?: MutateOptions<unknown, unknown, unknown, unknown>,
) {
  const client = useClient()
  const queryClient = useQueryClient()
  return useMutation(
    (updates: Partial<LogEntry>) => {
      return client(`log-entries/${updates.id}`, {
        method: 'PUT',
        data: updates,
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
  options?: MutateOptions<unknown, unknown, unknown, unknown>,
) {
  const client = useClient()
  const queryClient = useQueryClient()
  return useMutation(
    ({id}: {id: string}) => {
      return client(`log-entries/${id}`, {
        method: 'DELETE',
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
