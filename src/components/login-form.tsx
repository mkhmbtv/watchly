import * as React from 'react'

export interface FormData {
  username: string
  password: string
}

type Props = {
  onSubmit: (formData: FormData) => void
  submitButton: React.ReactElement
}

function LoginForm({onSubmit, submitButton}: Props) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      username: {value: string}
      password: {value: string}
    }
    onSubmit({
      username: target.username.value,
      password: target.password.value,
    })
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" />
      </div>
      <div>
        <label htmlFor="password">Username</label>
        <input id="password" type="password" />
      </div>
      <div>{React.cloneElement(submitButton, {type: 'submit'})}</div>
    </form>
  )
}

export {LoginForm}
