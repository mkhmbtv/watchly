import {Buffer} from 'buffer'
import {HttpError} from '../error'
import {User, UserCredentials, SanitizedUser, AuthUser} from 'types/user'

const usersKey = '__watchly_users__'
type UserStore = {
  [key: string]: User
}
let users: UserStore = {}

const persist = () =>
  window.localStorage.setItem(usersKey, JSON.stringify(users))
const load = () =>
  Object.assign(users, JSON.parse(window.localStorage.getItem(usersKey) || ''))

try {
  load()
} catch (error) {
  persist()
}

function validateUserForm({username, password}: UserCredentials) {
  if (!username) {
    throw new HttpError(400, 'A username is required')
  }
  if (!password) {
    throw new HttpError(400, 'A password is required')
  }
}

async function authenticate({
  username,
  password,
}: UserCredentials): Promise<AuthUser> {
  validateUserForm({username, password})
  const id = hash(username)
  const user = users[id] || {}
  if (user.passwordHash === hash(password)) {
    return {
      ...sanitizeUser(user),
      token: Buffer.from(user.id, 'binary').toString('base64'),
    }
  }
  throw new HttpError(400, 'Invalid username or password')
}

async function create({
  username,
  password,
}: UserCredentials): Promise<SanitizedUser> {
  validateUserForm({username, password})
  const id = hash(username)
  const passwordHash = hash(password)
  if (users[id]) {
    throw new HttpError(
      400,
      `Cannot create a new user with the username ${username}`,
    )
  }
  users[id] = {id, username, passwordHash}
  persist()
  return read(id)
}

async function update(
  id: string,
  updates: Partial<User>,
): Promise<SanitizedUser> {
  validateUser(id)
  Object.assign(users[id], updates)
  persist()
  return read(id)
}

async function remove(id: string) {
  validateUser(id)
  delete users[id]
  persist()
}

async function read(id: string): Promise<SanitizedUser> {
  validateUser(id)
  return sanitizeUser(users[id])
}

function sanitizeUser(user: User): SanitizedUser {
  const {passwordHash, ...rest} = user
  return rest
}

function validateUser(id: string) {
  load()
  if (!users[id]) {
    throw new HttpError(404, `No user with the id "${id}"`)
  }
}

function hash(str: string): string {
  let hash = 5381,
    i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return String(hash >>> 0)
}

async function reset() {
  users = {}
  persist()
}

export {authenticate, create, update, remove, read, reset}
