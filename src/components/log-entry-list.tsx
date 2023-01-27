import * as React from 'react'
import {useLogEntries} from 'utils/log-entries'
import {MovieRow} from './movie-row'
import {LogEntryWithMovie} from 'types/log-entry'

type Props = {
  filterListItems: (listItem: LogEntryWithMovie) => boolean
  noListItems: React.ReactElement
  noFilteredListItems: React.ReactElement
}

function LogEntryList({
  filterListItems,
  noListItems,
  noFilteredListItems,
}: Props) {
  const logEntries = useLogEntries()

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
        <li key={li.id} aria-label={li.movie.title}>
          <MovieRow movie={li.movie} />
        </li>
      ))}
    </ul>
  )
}

export {LogEntryList}
