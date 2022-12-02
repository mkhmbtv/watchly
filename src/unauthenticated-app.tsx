import * as React from 'react'
import {LoginForm} from './components/login-form'
import {Logo} from './components/logo'
import {Modal, ModalOpenButton, ModalContents} from './components/modal'
import {Button} from './components/button'
import {UserFormData} from './types/user'

type Props = {
  login: (credentials: UserFormData) => Promise<void>
  register: (credentials: UserFormData) => Promise<void>
}

function UnauthenticatedApp({login, register}: Props) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <Logo width="120" height="120" />
      <h1 className="text-4xl mb-4 font-bold">Movify</h1>
      <div className="grid grid-cols-2 gap-3">
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form" title="Login">
            <LoginForm
              onSubmit={login}
              submitButton={<Button variant="primary">Login</Button>}
            />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form" title="Register">
            <LoginForm
              onSubmit={register}
              submitButton={<Button variant="secondary">Register</Button>}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  )
}

export {UnauthenticatedApp}
