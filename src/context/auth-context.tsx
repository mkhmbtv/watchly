import * as React from 'react'
import * as session from 'services/session'
import {useQueryClient} from 'react-query'
import {AuthUser, UserFormData} from 'types/user'
import {useAsync} from 'hooks/useAsync'
import {client} from 'utils/api-client'
import {FullPageSpinner} from 'components/spinner'

type AuthContextType = {
  user?: AuthUser | null
  login: (formData: UserFormData) => Promise<void>
  register: (formData: UserFormData) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)
AuthContext.displayName = 'AuthContext'

function AuthProvider({children}: {children: React.ReactNode}) {
  const {
    data: user,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    error,
    run,
    status,
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
    return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function useClient<TResponse>() {
  const {user} = useAuth()
  const token = user?.token
  return React.useCallback(
    (endpoint: string, config?: Parameters<typeof client>[1]) =>
      client<TResponse>(endpoint, {...config, token}),
    [token],
  )
}

export {AuthProvider, useAuth, useClient}
