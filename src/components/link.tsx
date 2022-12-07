import clsx from 'clsx'
import * as React from 'react'
import {Link as RouterLink, LinkProps} from 'react-router-dom'

function Link({to, className, ...props}: LinkProps) {
  return (
    <RouterLink
      to={to}
      className={clsx(
        'text-green-500 hover:text-green-600 hover:underline',
        className,
      )}
      {...props}
    />
  )
}

export {Link}
