import * as React from 'react'
import clsx from 'clsx'
import {ImSpinner2} from 'react-icons/im'

function Spinner({className, ...props}: Parameters<typeof ImSpinner2>[0]) {
  return (
    <ImSpinner2
      aria-label="loading"
      className={clsx('animate-spin inline-block', className)}
      {...props}
    />
  )
}

function FullPageSpinner() {
  return (
    <div className="text-7xl h-screen flex flex-col justify-center items-center">
      <Spinner />
    </div>
  )
}

export {Spinner, FullPageSpinner}
