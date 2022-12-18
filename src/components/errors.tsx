import * as React from 'react'
import clsx from 'clsx'

interface ErrorMessageProps {
  error: Error
  className?: string
  variant?: 'stacked' | 'inline'
}

const errorVariants = {
  stacked: 'block',
  inline: 'inline-block',
}

function ErrorMessage({
  error,
  className,
  variant = 'stacked',
  ...props
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={clsx(`text-red-500 ${errorVariants[variant]}`, className)}
      {...props}
    >
      <span>There was an error:</span>
      <pre className={`whitespace-pre-wrap -mb-1.5 ${errorVariants[variant]}`}>
        {error.message}
      </pre>
    </div>
  )
}

function FullPageErrorFallback({error}: {error: Error}) {
  return (
    <div
      role="alert"
      className="text-red-500 h-screen flex flex-col justify-center items-center"
    >
      <p>Uh oh... Something went wrong. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export {ErrorMessage, FullPageErrorFallback}
