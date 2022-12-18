import * as React from 'react'
import {useLogEntries} from 'utils/log-entries'
import {MovieRow} from './movie-row'
import {LogEntryWithMovie} from 'types/log-entry'
import {AuthUser} from 'types/user'

type Props = {
  user: AuthUser
  filterListItems: (listItem: LogEntryWithMovie) => boolean
  noListItems: React.ReactElement
  noFilteredListItems: React.ReactElement
}

function LogEntryList({
  user,
  filterListItems,
  noListItems,
  noFilteredListItems,
}: Props) {
  const logEntries = useLogEntries(user)

  const filteredListItems = logEntries?.filter(filterListItems)

  if (!logEntries.length) {
    return <div className="text-lg">{noListItems}</div>
  }

  if (!filteredListItems.length) {
    return <div className="text-lg">{noFilteredListItems}</div>
  }

  if (filteredListItems.every(item => Boolean(item.watchedDate))) {
    filteredListItems.sort(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (a, b) => a.watchedDate! - b.watchedDate!,
    )
  }

  return (
    <ul>
      {filteredListItems?.map(li => (
        <li key={li.id}>
          <MovieRow movie={li.movie} user={user} />
        </li>
      ))}
    </ul>
  )
}

export {LogEntryList}
