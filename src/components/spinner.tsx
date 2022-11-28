import * as React from 'react'
import clsx from 'clsx'
import {FaSpinner} from 'react-icons/fa'

function Spinner({className, ...props}: Parameters<typeof FaSpinner>[0]) {
  return (
    <FaSpinner
      aria-label="loading"
      className={clsx('animate-spin', className)}
      {...props}
    />
  )
}

export {Spinner}
