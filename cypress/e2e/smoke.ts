import {buildUser} from '../support/build'

describe('smoke', () => {
  it('should allow a typical user flow', () => {
    const {username, password} = buildUser()
    cy.visit('/')
    cy.findByRole('button', {name: /register/i}).click()

    cy.findByRole('dialog').within(() => {
      cy.findByRole('textbox', {name: /username/i}).type(username)
      cy.findByLabelText(/password/i).type(password)
      cy.findByRole('button', {name: /register/i}).click()
    })

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /discover/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findByRole('textbox', {name: /search/i}).type('Parasite{enter}')
      cy.findByRole('listitem', {name: /parasite/i}).within(() => {
        cy.findByRole('button', {name: /add to watchlist/i}).click()
      })
    })

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /watchlist/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', 1)
      cy.findByRole('link', {name: /parasite/i}).click()
    })

    cy.findByRole('button', {name: /notes/i}).click()
    cy.findByRole('textbox', {name: /add your personal notes/i}).type(
      'Great movie',
    )
    cy.findByLabelText(/loading/i).should('exist')
    cy.findByLabelText(/loading/i).should('not.exist')
    cy.findByRole('button', {name: /close/i}).click()

    cy.findByRole('button', {name: /mark as watched/i}).click()

    cy.findByRole('radio', {name: /5 stars/i}).click({force: true})

    cy.findByRole('button', {name: /mark as favorite/i}).click()

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /history/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', 1)
      cy.findByRole('radio', {name: /5 stars/i}).should('be.checked')
    })

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /favorites/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', 1)
      cy.findByRole('link', {name: /parasite/i}).click()
    })

    cy.findByRole('button', {name: /remove from list/i}).click()
    cy.findByRole('button', {name: /notes/i}).should('not.exist')
    cy.findByRole('radio', {name: /5 stars/}).should('not.exist')

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /history/i}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', 0)
    })
  })
})
