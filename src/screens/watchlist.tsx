import * as React from 'react'
import {LogEntryList} from 'components/log-entry-list'
import {Link} from 'components/link'

function WatchlistScreen() {
  return (
    <LogEntryList
      filterListItems={logEntry => !logEntry.watchedDate}
      noListItems={
        <p>
          Welcome to your watchlist! Get started by heading over to{' '}
          <Link to="/discover">the Discover page</Link> to add movies to your
          watchlist.
        </p>
      }
      noFilteredListItems={
        <p>
          Looks like you&apos;ve finished watching all your movies. Check them
          out in your <Link to="/history">history</Link> or{' '}
          <Link to="/discover">discover more</Link>.
        </p>
      }
    />
  )
}

export {WatchlistScreen}
