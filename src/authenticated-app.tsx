import * as React from 'react'
import {Routes, Route} from 'react-router-dom'
import {DiscoverMoviesScreen} from './screens/discover'
import {MovieScreen} from 'screens/movie'
import {NotFoundScreen} from 'screens/not-found'
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
      <div className="max-w-4xl m-auto py-10 w-[90vw]">
        <AppRoutes user={user} />
      </div>
    </div>
  )
}

function AppRoutes({user}: {user: AuthUser}) {
  return (
    <Routes>
      <Route path="/discover" element={<DiscoverMoviesScreen />} />
      <Route path="/movie/:movieId" element={<MovieScreen user={user} />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}

export {AuthenticatedApp}
