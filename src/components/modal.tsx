import * as React from 'react'
import {Dialog} from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'

function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach(fn => fn?.(...args))
}

type ModalContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type WithChildren = {
  children: React.ReactNode | Array<React.ReactNode>
}

interface Props extends WithChildren {
  title: string
}

const ModalContext = React.createContext<ModalContextType | null>(null)

function Modal({children}: WithChildren) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <ModalContext.Provider value={{isOpen, setIsOpen}}>
      {children}
    </ModalContext.Provider>
  )
}

function useModalContext(): ModalContextType {
  const context = React.useContext(ModalContext)

  if (!context) {
    throw new Error('useModalContext must be used within <Modal />')
  }
  return context
}

function ModalCloseButton({children: child}: WithChildren) {
  const {setIsOpen} = useModalContext()

  if (!React.isValidElement(child)) {
    throw new Error(
      'ModalCloseButton must have a valid React element as its child',
    )
  }

  return React.cloneElement(child as React.ReactElement, {
    onClick: callAll(() => setIsOpen(false), child.props?.onClick),
  })
}

function ModalOpenButton({children: child}: WithChildren) {
  const {setIsOpen} = useModalContext()

  if (!React.isValidElement(child)) {
    throw new Error(
      'ModalOpenButton must have a valid React element as its child',
    )
  }

  return React.cloneElement(child as React.ReactElement, {
    onClick: callAll(() => setIsOpen(true), child.props?.onClick),
  })
}

function ModalContentsBase(props: React.PropsWithChildren) {
  const {isOpen, setIsOpen} = useModalContext()
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

function ModalContents({title, children, ...props}: Props) {
  return (
    <ModalContentsBase {...props}>
      <div className="flex justify-end">
        <ModalCloseButton>
          <button className="rounded-full w-10 h-10 leading-none flex items-center justify-center border border-solid border-gray-100">
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </button>
        </ModalCloseButton>
      </div>
      <h3 className="text-center text-3xl font-medium">{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

export {
  Modal,
  ModalCloseButton,
  ModalOpenButton,
  ModalContentsBase,
  ModalContents,
}
