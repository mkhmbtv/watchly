export interface BaseUser {
  username: string
}

export interface SanitizedUser extends BaseUser {
  id: string
}

export interface UserCredentials extends BaseUser {
  password: string
}

export interface UserCredentialsWithId extends UserCredentials, SanitizedUser {}

export interface User extends SanitizedUser {
  passwordHash: string
}

export interface AuthUser extends SanitizedUser {
  token: string
}
