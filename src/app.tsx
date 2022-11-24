import '@reach/dialog/styles.css'
import * as React from 'react'
import {Dialog} from '@reach/dialog'
import {LoginForm, FormData} from './components/login-form'

function App() {
  const [openModal, setOpenModal] = React.useState('none')
  const login = (formData: FormData) => {
    console.log('login', formData)
  }
  const register = (formData: FormData) => {
    console.log('register', formData)
  }

  return (
    <div>
      <div>
        <button onClick={() => setOpenModal('login')}>Login</button>
      </div>
      <div>
        <button onClick={() => setOpenModal('register')}>Register</button>
      </div>
      <Dialog aria-label="Login form" isOpen={openModal === 'login'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Login</h3>
        <LoginForm onSubmit={login} submitButton={<button>Login</button>} />
      </Dialog>
      <Dialog aria-label="Registration form" isOpen={openModal === 'register'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Register</h3>
        <LoginForm
          onSubmit={register}
          submitButton={<button>Register</button>}
        />
      </Dialog>
    </div>
  )
}

export default App
