export interface BaseUser {
  username: string
}

export interface SanitizedUser extends BaseUser {
  id: string
}

export interface UserFormData extends BaseUser {
  password: string
}

export interface User extends SanitizedUser {
  passwordHash: string
}

export interface AuthUser extends SanitizedUser {
  token: string
}
