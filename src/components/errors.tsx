import * as React from 'react'

interface ErrorMessageProps {
  error: Error
  variant?: 'stacked' | 'inline'
}

const errorVariants = {
  stacked: 'block',
  inline: 'inline-block',
}

function ErrorMessage({
  error,
  variant = 'stacked',
  ...props
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={`text-red-500 ${errorVariants[variant]}`}
      {...props}
    >
      <span>There was an error:</span>
      <pre className={`whitespace-pre-wrap -mb-1.5 ${errorVariants[variant]}`}>
        {error.message}
      </pre>
    </div>
  )
}

export {ErrorMessage}
