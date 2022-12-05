import * as React from 'react'
import {Link, useMatch} from 'react-router-dom'
import clsx from 'clsx'
import {Logo} from './logo'
import {Button} from './button'
import {AuthUser} from 'types/user'

const LINKS = [
  {name: 'Watchlist', to: '/watchlist'},
  {name: 'Films', to: '/films'},
  {name: 'Discover', to: '/discover'},
]

type Props = {
  user: AuthUser
  logout: () => void
}

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

function Navbar({user, logout}: Props) {
  return (
    <div className="px-[15vw] py-9">
      <nav className="max-w-8xl mx-auto flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center">
            <Logo width="60" height="60" />
            <h1 className="text-3xl font-semibold ml-2">Movify</h1>
          </div>
        </Link>
        <ul className="flex items-center">
          {LINKS.map(link => (
            <NavLink key={link.name} to={link.to}>
              {link.name}
            </NavLink>
          ))}
        </ul>
        <div className="flex items-center">
          <span className="text-lg">{user.username}</span>
          <Button variant="secondary" className="ml-2.5" onClick={logout}>
            Logout
          </Button>
        </div>
      </nav>
    </div>
  )
}

export {Navbar}
