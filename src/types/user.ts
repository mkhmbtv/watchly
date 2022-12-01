export interface User {
  id: string
  username: string
  passwordHash: string
}

export interface UserFormData {
  username: string
  password: string
}
