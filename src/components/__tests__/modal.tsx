import * as React from 'react'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Modal, ModalContents, ModalOpenButton} from '../modal'

test('can be opened and closed', async () => {
  const title = 'Modal title'
  const label = 'Modal label'
  const content = 'Modal content'

  render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents aria-label={label} title={title}>
        <div>{content}</div>
      </ModalContents>
    </Modal>,
  )

  await userEvent.click(screen.getByRole('button', {name: /open/i}))

  const modal = screen.getByRole('dialog')
  expect(modal).toHaveAttribute('aria-label', label)

  const withinModal = within(modal)
  expect(withinModal.getByRole('heading', {name: title})).toBeInTheDocument()
  expect(withinModal.getByText(content)).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', {name: /close/i}))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
