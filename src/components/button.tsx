import clsx from 'clsx'
import * as React from 'react'

interface ButtonProps {
  variant: 'primary' | 'secondary'
  children: React.ReactNode | Array<React.ReactNode>
}

function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps & JSX.IntrinsicElements['button']) {
  return (
    <button
      className={clsx(
        'py-2.5 px-3.5 border-0 leading-none rounded-sm',
        className,
        {
          'bg-green-600 text-white': variant === 'primary',
          'bg-gray-300 text-gray-800': variant === 'secondary',
        },
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const CircleButton = React.forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements['button']
>(function CircleButton({className, children, ...props}, ref) {
  return (
    <button
      ref={ref}
      className={clsx(
        'rounded-full w-10 h-10 leading-none flex items-center justify-center text-gray-800 border border-solid border-gray-200',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})

export {Button, CircleButton}
