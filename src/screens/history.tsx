import * as React from 'react'
import {LogEntryList} from 'components/log-entry-list'
import {Link} from 'components/link'

function HistoryScreen() {
  return (
    <LogEntryList
      filterListItems={li => Boolean(li.watchedDate)}
      noListItems={
        <p>
          This is where movies will go when you finish watching them. Get
          started by heading over to{' '}
          <Link to="/discover">the Discover page</Link> to explore some movies.
        </p>
      }
      noFilteredListItems={
        <p>
          Looks like you&apos;ve got some movies to watch! Check them out in
          your <Link to="/watchlist">watchlist</Link> or{' '}
          <Link to="/discover">discover more</Link>.
        </p>
      }
    />
  )
}

export {HistoryScreen}
