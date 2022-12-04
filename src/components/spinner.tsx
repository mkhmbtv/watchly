import * as React from 'react'
import clsx from 'clsx'
import {FaSpinner} from 'react-icons/fa'

function Spinner({className, ...props}: Parameters<typeof FaSpinner>[0]) {
  return (
    <FaSpinner
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
