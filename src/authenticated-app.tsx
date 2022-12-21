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
import {FavoritesScreen} from 'screens/favorites'

function ErrorFallback({error}: {error: Error}) {
  return (
    <ErrorMessage
      error={error}
      className="flex flex-col h-full justify-center items-center"
    />
  )
}

function AuthenticatedApp() {
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <Navbar />
      <main className="max-w-4.5xl m-auto py-10 w-[90vw]">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AppRoutes />
        </ErrorBoundary>
      </main>
    </ErrorBoundary>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/discover" element={<DiscoverMoviesScreen />} />
      <Route path="/movie/:movieId" element={<MovieScreen />} />
      <Route path="/watchlist" element={<WatchlistScreen />} />
      <Route path="/history" element={<HistoryScreen />} />
      <Route path="/favorites" element={<FavoritesScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}

export {AuthenticatedApp}
