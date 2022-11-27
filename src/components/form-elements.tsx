import * as React from 'react'
import clsx from 'clsx'

const FormGroup = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[]
}) => {
  return <div className="flex flex-col">{children}</div>
}

type InputProps =
  | ({type: 'textarea'} & JSX.IntrinsicElements['textarea'])
  | JSX.IntrinsicElements['input']

function Input(props: InputProps) {
  const className = clsx(
    'py-2 px-3 border-2 border-solid border-gray-100 bg-gray-200',
    props.className,
  )

  if (props.type === 'textarea') {
    return (
      <textarea
        {...(props as JSX.IntrinsicElements['textarea'])}
        className={className}
      />
    )
  }

  return (
    <input
      {...(props as JSX.IntrinsicElements['input'])}
      className={className}
    />
  )
}

export {Input, FormGroup}
