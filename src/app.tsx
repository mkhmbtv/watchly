import '@reach/dialog/styles.css'
import * as React from 'react'
import {LoginForm, FormData} from './components/login-form'
import {Modal, ModalOpenButton, ModalContents} from './components/modal'

function App() {
  const login = (formData: FormData) => {
    console.log('login', formData)
  }
  const register = (formData: FormData) => {
    console.log('register', formData)
  }

  return (
    <div>
      <div>
        <Modal>
          <ModalOpenButton>
            <button>Login</button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form" title="Login">
            <LoginForm onSubmit={login} submitButton={<button>Login</button>} />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <button>Register</button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form" title="Register">
            <LoginForm
              onSubmit={register}
              submitButton={<button>Register</button>}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  )
}

export default App
