import * as React from 'react'
import * as userService from 'services/user'
import {useQueryClient} from 'react-query'
import {AuthUser, UserCredentials} from 'types/user'
import {useAsync} from 'hooks/useAsync'
import {client} from 'utils/api-client'
import {FullPageSpinner} from 'components/spinner'

type AuthContextType = {
  user?: AuthUser | null
  login: (formData: UserCredentials) => Promise<void>
  register: (formData: UserCredentials) => Promise<void>
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

  const login = React.useCallback(
    (formData: UserCredentials) =>
      userService.login(formData).then(user => setData(user)),
    [setData],
  )
  const register = React.useCallback(
    (formData: UserCredentials) =>
      userService.register(formData).then(user => setData(user)),
    [setData],
  )
  const logout = React.useCallback(() => {
    userService.logout()
    queryClient.clear()
    setData(null)
  }, [queryClient, setData])

  React.useEffect(() => {
    const userDataPromise = userService.getUserData(queryClient)
    run(userDataPromise)
  }, [queryClient, run])

  const props = React.useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [login, logout, register, user],
  )

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
