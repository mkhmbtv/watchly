import * as React from 'react'
import {AuthUser} from './types/user'
import {DiscoverMoviesScreen} from './screens/discover'
import {MovieScreen} from 'screens/movie'
import {Navbar} from './components/navbar'

type Props = {
  user: AuthUser
  logout: () => void
}

function AuthenticatedApp({user, logout}: Props) {
  return (
    <div>
      <Navbar user={user} logout={logout} />
      <div className="max-w-4xl m-auto py-10 w-[90vw]">
        {/* <DiscoverMoviesScreen /> */}
        <MovieScreen />
      </div>
    </div>
  )
}

export {AuthenticatedApp}
