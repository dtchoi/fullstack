describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      username: 'dtchoi',
      name: 'Daniel Choi',
      password: 'thisisatestpassword'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('dtchoi')
      cy.get('#password').type('thisisatestpassword')
      cy.get('#login-button').click()

      cy.contains('Daniel Choi logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('dtchoi')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Daniel Choi logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'dtchoi', password: 'thisisatestpassword' })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('How to E2E Test')
      cy.get('#author').type('Mochi')
      cy.get('#url').type('http://cypress/test')

      cy.get('#create-button').click()
      cy.contains('a new blog How to E2E Test added')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'How to E2E Test', author: 'Mochi', url: 'http://cypress/test', likes: 1 })
      })

      it('user can like a blog', function() {
        cy.contains('How to E2E Test')
          .contains('view')
          .click()

        cy.contains('like').click()

        cy.contains('likes 1')
      })

      it('user who created can delete the blog', function() {
        cy.contains('How to E2E Test')
          .contains('view')
          .click()

        cy.contains('delete').click()

        cy.get('html').should('not.contain', 'How to E2E Test Mochi')
      })

      it('only the user who created the blog can delete', function() {
        const user = {
          username: 'mlim',
          name: 'Michael Lim',
          password: 'pass2'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.login({ username: 'mlim', password: 'pass2' })

        cy.contains('How to E2E Test')
          .contains('view')
          .click()
        cy.get('.deleteContent').should('not.be.visible')
      })
    })

    describe('and multiple blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'The title with the second most likes', author: 'Bear', url: 'http://cypress/test', likes: 1 })
        cy.createBlog({ title: 'The title with the most likes', author: 'Mochi', url: 'http://cypress/test', likes: 2 })
        cy.visit('')
      })

      it.only('the blogs are ordered by likes', function() {
        cy.contains('The title with the second most likes').contains('view').click()
        cy.contains('The title with the most likes').contains('view').click()
        cy.contains('The title with the second most likes').parent().find('button').then(buttons => {
          console.log(buttons.length)
          cy.wrap(buttons[2]).click()
        })
        cy.contains('The title with the second most likes').parent().contains('2')
        cy.contains('The title with the second most likes').parent().find('button').then(buttons => {
          console.log(buttons.length)
          cy.wrap(buttons[2]).click()
        })
        cy.visit('')
        cy.contains('The title with the second most likes').contains('view').click()
        cy.contains('The title with the most likes').contains('view').click()
        cy.get('.blog').eq(1).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(0).should('contain', 'The title with the second most likes')
      })
    })
  })
})