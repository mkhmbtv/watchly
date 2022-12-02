import {client} from 'utils/api-client'
import {AuthUser, UserFormData} from 'types/user'

const localStorageKey = '__app_auth_token__'

async function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

async function handleUserResponse(user: AuthUser): Promise<AuthUser> {
  window.localStorage.setItem(localStorageKey, user.token)
  return user
}

function login({username, password}: UserFormData): Promise<AuthUser> {
  return client<AuthUser>('login', {data: {username, password}}).then(
    handleUserResponse,
  )
}

function register({username, password}: UserFormData): Promise<AuthUser> {
  return client<AuthUser>('register', {
    data: {username, password},
  }).then(handleUserResponse)
}

function logout() {
  window.localStorage.removeItem(localStorageKey)
}

export {getToken, login, register, logout}
