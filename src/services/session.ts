import {QueryClient} from 'react-query'
import {client} from 'utils/api-client'
import {setQueryDataForMovie} from 'utils/movies'
import {AuthUser, UserFormData} from 'types/user'
import {LogEntryWithMovie} from 'types/log-entry'

const localStorageKey = '__app_auth_token__'

async function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

type AuthenticateUser = (credentials: UserFormData) => Promise<AuthUser>
interface UserDataResponse {
  user: AuthUser
}

async function getUserData(queryClient: QueryClient): Promise<AuthUser | null> {
  let user = null
  const token = await getToken()
  if (token) {
    const data = await client<{
      user: AuthUser
      logEntries: LogEntryWithMovie[]
    }>('bootstrap', {token})
    queryClient.setQueryData('log-entries', data.logEntries)

    for (const logEntry of data.logEntries) {
      setQueryDataForMovie(queryClient, logEntry.movie)
    }

    user = data.user
  }

  return user
}

async function handleUserResponse({user}: UserDataResponse): Promise<AuthUser> {
  window.localStorage.setItem(localStorageKey, user.token)
  return user
}

const login: AuthenticateUser = ({username, password}) => {
  return client<UserDataResponse>('login', {data: {username, password}}).then(
    handleUserResponse,
  )
}

const register: AuthenticateUser = ({username, password}) => {
  return client<UserDataResponse>('register', {
    data: {username, password},
  }).then(handleUserResponse)
}

async function logout() {
  window.localStorage.removeItem(localStorageKey)
}

export {getToken, getUserData, login, register, logout, localStorageKey}
