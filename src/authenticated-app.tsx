import * as React from 'react'
import {Routes, Route} from 'react-router-dom'
import {DiscoverMoviesScreen} from './screens/discover'
import {MovieScreen} from './screens/movie'
import {WatchlistScreen} from './screens/watchlist'
import {HistoryScreen} from 'screens/history'
import {NotFoundScreen} from './screens/not-found'
import {Navbar} from './components/navbar'
import {AuthUser} from './types/user'

type Props = {
  user: AuthUser
  logout: () => void
}

function AuthenticatedApp({user, logout}: Props) {
  return (
    <div>
      <Navbar user={user} logout={logout} />
      <div className="max-w-4.5xl m-auto py-10 w-[90vw]">
        <AppRoutes user={user} />
      </div>
    </div>
  )
}

function AppRoutes({user}: {user: AuthUser}) {
  return (
    <Routes>
      <Route path="/discover" element={<DiscoverMoviesScreen user={user} />} />
      <Route path="/movie/:movieId" element={<MovieScreen user={user} />} />
      <Route path="/watchlist" element={<WatchlistScreen user={user} />} />
      <Route path="/history" element={<HistoryScreen user={user} />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}

export {AuthenticatedApp}
