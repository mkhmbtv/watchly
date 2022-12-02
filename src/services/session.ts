import {client} from 'utils/api-client'
import {AuthUser, UserFormData} from 'types/user'

const localStorageKey = '__app_auth_token__'

async function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

type AuthenticateUser = (credentials: UserFormData) => Promise<AuthUser>

async function handleUserResponse(user: AuthUser): Promise<AuthUser> {
  window.localStorage.setItem(localStorageKey, user.token)
  return user
}

const login: AuthenticateUser = ({username, password}) => {
  return client<AuthUser>('login', {data: {username, password}}).then(
    handleUserResponse,
  )
}

const register: AuthenticateUser = ({username, password}) => {
  return client<AuthUser>('register', {data: {username, password}}).then(
    handleUserResponse,
  )
}

function logout() {
  window.localStorage.removeItem(localStorageKey)
}

export {getToken, login, register, logout}
