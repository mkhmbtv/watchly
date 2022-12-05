import * as React from 'react'
import {AuthUser} from './types/user'
import {DiscoverMoviesScreen} from './screens/discover'
import {Navbar} from './components/navbar'

type Props = {
  user: AuthUser
  logout: () => void
}

function AuthenticatedApp({user, logout}: Props) {
  return (
    <div>
      <Navbar user={user} logout={logout} />
      <div>
        <DiscoverMoviesScreen />
      </div>
    </div>
  )
}

export {AuthenticatedApp}
