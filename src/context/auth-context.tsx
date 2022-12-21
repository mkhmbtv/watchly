import * as React from 'react'
import {AuthUser, UserFormData} from 'types/user'

type AuthContextType = {
  user?: AuthUser | null
  login: (formData: UserFormData) => Promise<void>
  register: (formData: UserFormData) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthContext Provider')
  }
  return context
}

export {AuthContext, useAuth}
