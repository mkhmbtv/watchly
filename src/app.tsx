import * as React from 'react'
import * as session from './services/session'
import {BrowserRouter as Router} from 'react-router-dom'
import {useQueryClient} from 'react-query'
import {AuthUser, UserFormData} from './types/user'
import {AuthenticatedApp} from 'authenticated-app'
import {UnauthenticatedApp} from 'unauthenticated-app'
import {useAsync} from './hooks/useAsync'
import {FullPageSpinner} from './components/spinner'

function App() {
  const {
    data: user,
    isIdle,
    isLoading,
    isError,
    error,
    run,
    setData,
  } = useAsync<AuthUser | null>()

  const queryClient = useQueryClient()

  const login = (formData: UserFormData) =>
    session.login(formData).then(user => setData(user))
  const register = (formData: UserFormData) =>
    session.register(formData).then(user => setData(user))
  const logout = () => {
    session.logout()
    queryClient.clear()
    setData(null)
  }

  React.useEffect(() => {
    run(session.getUser())
  }, [run])

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return (
      <div className="text-red-500 h-screen flex flex-col justify-center items-center">
        <p>Uh oh... There is a problem. Try refreshing the app.</p>
        <pre>{error?.message}</pre>
      </div>
    )
  }

  return user ? (
    <Router>
      <AuthenticatedApp user={user} logout={logout} />
    </Router>
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export default App
