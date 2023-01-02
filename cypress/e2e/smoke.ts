import {buildUser} from '../support/build'

describe('smoke', () => {
  it('should allow a typical user flow', () => {
    const user = buildUser()
    cy.visit('/')
    cy.findByRole('button', {name: /register/i}).click()
  })
})
