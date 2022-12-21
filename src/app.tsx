import * as React from 'react'
import * as session from './services/session'
import {BrowserRouter as Router} from 'react-router-dom'
import {useQueryClient} from 'react-query'
import {AuthUser, UserFormData} from './types/user'
import {AuthContext} from 'context/auth-context'
import {AuthenticatedApp} from 'authenticated-app'
import {UnauthenticatedApp} from 'unauthenticated-app'
import {useAsync} from './hooks/useAsync'
import {FullPageSpinner} from './components/spinner'

function App() {
  const {
    data: user,
    isIdle,
    isLoading,
    isSuccess,
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

  if (isSuccess) {
    const props = {user, login, register, logout}
    return (
      <AuthContext.Provider value={props}>
        {user ? (
          <Router>
            <AuthenticatedApp />
          </Router>
        ) : (
          <UnauthenticatedApp />
        )}
      </AuthContext.Provider>
    )
  }
  return null
}

export default App
