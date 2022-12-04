import {client} from 'utils/api-client'
import {AuthUser, UserFormData} from 'types/user'

const localStorageKey = '__app_auth_token__'

async function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

type AuthenticateUser = (credentials: UserFormData) => Promise<AuthUser>
interface UserDataResponse {
  user: AuthUser
}

async function getUser(): Promise<AuthUser | null> {
  const token = await getToken()
  if (!token) {
    return Promise.resolve(null)
  }

  return client<{user: AuthUser}>('me', {token}).then(data => data.user)
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

export {getToken, getUser, login, register, logout}
