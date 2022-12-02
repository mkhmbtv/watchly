import * as React from 'react'
import * as session from './services/session'
import {AuthUser, UserFormData} from './types/user'
import {AuthenticatedApp} from 'authenticated-app'
import {UnauthenticatedApp} from 'unauthenticated-app'

function App() {
  const [user, setUser] = React.useState<AuthUser | null>(null)

  const login = (formData: UserFormData) =>
    session.login(formData).then(u => setUser(u))
  const register = (formData: UserFormData) =>
    session.register(formData).then(u => setUser(u))
  const logout = () => {
    session.logout()
    setUser(null)
  }

  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export default App
