import * as React from 'react'
import {Link} from 'components/link'

function NotFoundScreen() {
  return (
    <div className="h-full flex justify-center items-center">
      Sorry, we can&apos;t find the page you&apos;re looking for.
      <Link to="/discover" className="ml-1">
        Go home
      </Link>
    </div>
  )
}

export {NotFoundScreen}
