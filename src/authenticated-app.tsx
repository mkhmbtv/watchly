import * as React from 'react'
import {AuthUser} from './types/user'
import {DiscoverMoviesScreen} from './screens/discover'
import {Button} from 'components/button'

type Props = {
  user: AuthUser
  logout: () => void
}

function AuthenticatedApp({user, logout}: Props) {
  return (
    <div>
      <div className="flex items-center absolute top-2.5 right-2.5">
        {user.username}
        <Button variant="secondary" className="ml-2.5" onClick={logout}>
          Logout
        </Button>
      </div>
      <div>
        <DiscoverMoviesScreen />
      </div>
    </div>
  )
}

export {AuthenticatedApp}
