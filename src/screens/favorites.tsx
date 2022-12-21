import * as React from 'react'
import {LogEntryList} from 'components/log-entry-list'
import {Link} from 'components/link'
import {AuthUser} from 'types/user'

function FavoritesScreen({user}: {user: AuthUser}) {
  return (
    <LogEntryList
      user={user}
      filterListItems={logEntry => Boolean(logEntry.favorite)}
      noListItems={
        <p>
          This is where your favorite movies will go. Get started by heading
          over to <Link to="/discover">the Discover page</Link> to explore some
          movies.
        </p>
      }
      noFilteredListItems={
        <p>
          Looks like you haven&apos;t added any favorite movies. Check your{' '}
          <Link to="/watchlist">watchlist</Link>,{' '}
          <Link to="/history">history</Link> or{' '}
          <Link to="/discover">discover more</Link> movies to watch.
        </p>
      }
    />
  )
}

export {FavoritesScreen}
