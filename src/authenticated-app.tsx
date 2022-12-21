import * as React from 'react'
import {Routes, Route} from 'react-router-dom'
import {ErrorBoundary} from 'react-error-boundary'
import {DiscoverMoviesScreen} from './screens/discover'
import {MovieScreen} from './screens/movie'
import {WatchlistScreen} from './screens/watchlist'
import {HistoryScreen} from 'screens/history'
import {NotFoundScreen} from './screens/not-found'
import {Navbar} from './components/navbar'
import {ErrorMessage, FullPageErrorFallback} from 'components/errors'
import {AuthUser} from './types/user'
import {FavoritesScreen} from 'screens/favorites'

function ErrorFallback({error}: {error: Error}) {
  return (
    <ErrorMessage
      error={error}
      className="flex flex-col h-full justify-center items-center"
    />
  )
}

type Props = {
  user: AuthUser
  logout: () => void
}

function AuthenticatedApp({user, logout}: Props) {
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <Navbar user={user} logout={logout} />
      <main className="max-w-4.5xl m-auto py-10 w-[90vw]">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AppRoutes user={user} />
        </ErrorBoundary>
      </main>
    </ErrorBoundary>
  )
}

function AppRoutes({user}: {user: AuthUser}) {
  return (
    <Routes>
      <Route path="/discover" element={<DiscoverMoviesScreen user={user} />} />
      <Route path="/movie/:movieId" element={<MovieScreen user={user} />} />
      <Route path="/watchlist" element={<WatchlistScreen user={user} />} />
      <Route path="/history" element={<HistoryScreen user={user} />} />
      <Route path="/favorites" element={<FavoritesScreen user={user} />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}

export {AuthenticatedApp}
