import * as React from 'react'
import {useAsync} from 'hooks/useAsync'
import {Input, FormGroup} from './form-elements'
import {Spinner} from './spinner'
import {ErrorMessage} from './errors'
import {UserFormData} from 'types/user'

type Props = {
  onSubmit: (formData: UserFormData) => Promise<void>
  submitButton: React.ReactElement
}

function LoginForm({onSubmit, submitButton}: Props) {
  const {isLoading, isError, error, run} = useAsync()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      username: {value: string}
      password: {value: string}
    }
    run(
      onSubmit({
        username: target.username.value,
        password: target.password.value,
      }),
    )
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
      <div>
        {React.cloneElement(
          submitButton,
          {type: 'submit'},
          ...(Array.isArray(submitButton.props.children)
            ? submitButton.props.children
            : [submitButton.props.children]),
          isLoading ? <Spinner className="inline-block ml-1" /> : null,
        )}
      </div>
      {isError ? <ErrorMessage error={error as Error} /> : null}
    </form>
  )
}

export {LoginForm}
