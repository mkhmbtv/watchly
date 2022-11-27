import * as React from 'react'
import {Dialog} from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import {CircleButton} from './button'

function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach(fn => fn?.(...args))
}

type ModalContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface WithChildren {
  children: React.ReactElement
}

interface Props {
  title: string
  children: React.ReactNode | Array<React.ReactNode>
}

const ModalContext = React.createContext<ModalContextType | null>(null)

function Modal(props: React.PropsWithChildren) {
  const [isOpen, setIsOpen] = React.useState(false)

  return <ModalContext.Provider value={{isOpen, setIsOpen}} {...props} />
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

  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props?.onClick),
  })
}

function ModalOpenButton({children: child}: WithChildren) {
  const {setIsOpen} = useModalContext()

  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props?.onClick),
  })
}

function ModalContentsBase(props: React.PropsWithChildren) {
  const {isOpen, setIsOpen} = useModalContext()
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={() => setIsOpen(false)}
      {...props}
      className="max-w-md rounded-sm pb-14 my-[20vh] mx-auto shadow-lg sm:w-full sm:my-[10vh]"
    />
  )
}

function ModalContents({title, children, ...props}: Props) {
  return (
    <ModalContentsBase {...props}>
      <div className="flex justify-end">
        <ModalCloseButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
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
