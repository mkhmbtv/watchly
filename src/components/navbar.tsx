import * as React from 'react'
import {Link, useMatch} from 'react-router-dom'
import clsx from 'clsx'
import {useAuth} from 'context/auth-context'
import {Logo} from './logo'
import {Button} from './button'

const LINKS = [
  {name: 'Watchlist', to: '/watchlist'},
  {name: 'History', to: '/history'},
  {name: 'Favorites', to: '/favorites'},
  {name: 'Discover', to: '/discover'},
]

function NavLink({
  to,
  ...props
}: Omit<Parameters<typeof Link>['0'], 'to'> & {to: string}) {
  const match = useMatch(to)
  return (
    <li className="px-5 py-2">
      <Link
        to={to}
        className={clsx(
          'text-gray-600 block text-lg font-medium transition border-b-2 border-b-white hover:text-black hover:border-b-2 hover:border-b-black duration-500',
          {
            'border-b-black': match,
          },
        )}
        {...props}
      />
    </li>
  )
}

function Navbar() {
  const {user, logout} = useAuth()
  return (
    <div className="py-9">
      <nav className="max-w-4.5xl mx-auto flex items-center justify-between sm:flex-col">
        <Link to="/discover">
          <div className="flex items-center">
            <Logo width="60" height="60" />
            <h1 className="text-3xl font-semibold ml-2">Movify</h1>
          </div>
        </Link>
        <ul className="flex items-center sm:flex-col sm:mb-5">
          {LINKS.map(link => (
            <NavLink key={link.name} to={link.to}>
              {link.name}
            </NavLink>
          ))}
        </ul>
        <div className="flex items-center">
          <span className="text-lg">{user?.username}</span>
          <Button variant="secondary" className="ml-2.5" onClick={logout}>
            Logout
          </Button>
        </div>
      </nav>
    </div>
  )
}

export {Navbar}
