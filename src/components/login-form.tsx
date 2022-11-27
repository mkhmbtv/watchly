import * as React from 'react'
import {Input, FormGroup} from './form-elements'

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-stretch [&>div]:my-2.5 [&>div]:mx-auto [&>div]:w-full [&>div]:max-w-xs"
    >
      <FormGroup>
        <label htmlFor="username">Username</label>
        <Input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>{React.cloneElement(submitButton, {type: 'submit'})}</div>
    </form>
  )
}

export {LoginForm}
