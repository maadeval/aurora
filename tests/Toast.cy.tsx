import { toast } from '../src'
import { Toast } from '../src/components/Toast'
import { mount } from 'cypress/react18'

describe('<Toast />', () => {
  it('render a toast with title', () => {
    const toastTitle = 'toast title'
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button'
          onClick={() =>
            toast.success({
              title: toastTitle,
            })
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button"]').click()

    cy.get('[data-testid="toast"]').should('be.visible')

    cy.get('h3').should('have.text', toastTitle)
  })

  it('should render correctly with body', () => {
    const toastBody = 'toast body'
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button'
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: toastBody,
            })
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button"]').click()

    cy.get('[data-testid="toast"]').should('be.visible')

    cy.get('p').should('have.text', toastBody)
  })

  it('should throw an error if title and body is empty', () => {
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button'
          onClick={() =>
            toast.success({
              title: '',
              body: '',
            })
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button"]').click()

    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Title or body is required')
    })
  })

  it('should render correctly with custom duration', () => {
    const customDuration = 1000
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button'
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: 'custom body',
              duration: customDuration,
            })
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button"]').click()

    cy.get('[data-testid="toast"]').should('be.visible')

    cy.wait(customDuration)

    cy.get('[data-testid="toast"]', {
      timeout: 500,
    }).should('not.exist')
  })

  it('should mantain toast open when mouse enter', () => {
    const customDuration = 1000
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button'
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: 'custom body',
              duration: customDuration,
            })
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button"]').click()

    cy.get('[data-testid="toast"]').should('be.visible')

    cy.get('[data-testid="toast"]').realHover()

    cy.wait(customDuration)

    cy.get('[data-testid="toast"]').should('be.visible')
  })

  it('should open multiple toasts', () => {
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button'
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: 'custom body',
            })
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button"]').click()

    cy.get('h3').should('have.text', 'custom title').should('have.length', 1)

    cy.get('[data-testid="button"]').click()

    cy.get('h3').should('have.length', 2)
  })

  it('should close automatic toasts by duration', () => {
    const duration = 1000
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button'
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: 'custom body',
              duration,
            })
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button"]').click() // <- show first toast

    cy.get('h3').should('have.text', 'custom title').should('have.length', 1)

    cy.wait(duration / 2)
    cy.get('[data-testid="button"]').click() // <- wait half duration and show second toast

    cy.get('[data-testid="button"]').realHover() // <= tricky: this prevent test environment put cursor on the toast making it not close at time

    cy.get('h3').should('have.length', 2)

    cy.wait(duration / 2)
    cy.get('h3').should('have.length', 1) // <- wait half duration and close first toast

    cy.wait(duration / 2 + 200)

    cy.get('[data-testid="toast"]').should('not.exist') // <- wait half duration and close second toast */
  })

  it('should pause all toasts when mause enter', () => {
    const duration = 1000
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button'
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: 'custom body',
              duration,
            })
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button"]').click() // <- show first toast

    cy.get('h3').should('have.text', 'custom title').should('have.length', 1)

    cy.wait(duration / 2)
    cy.get('[data-testid="button"]').click() // <- wait half duration and show second toast

    cy.get('h3').should('have.length', 2)

    cy.get('[data-testid="toast"]').realHover()

    cy.wait(duration)

    cy.get('[data-testid="toast"]').should('be.visible')
  })

  it.skip('should open differents types of toasts', () => {
    //TODO: create tests for all types of toasts ~ could be a good idea create a test using a foreach loop (check the docs)
  })

  it.skip('should change the type of toast by user action', () => {
    //TODO: could be a good idea do with TDD. This implementation is not done yet :)
  })

  it.skip('should close toast by click on close button', () => {
    //TODO: could be a good idea do with TDD. This implementation is not done yet :)
  })

  it.skip('should pin toast by click on pin button', () => {
    //TODO: could be a good idea do with TDD. This implementation is not done yet :)
  })

  it.skip('should render with specific position', () => {
    //TODO: could be a good idea do with TDD. This implementation is not done yet :)
  })

  it.skip('should render with custom icon', () => {
    //TODO: could be a good idea do with TDD. This implementation is not done yet :)
  })

  it.skip('should render with custom className', () => {
    //TODO: could be a good idea do with TDD. This implementation is not done yet :)
  })

  it.skip('should make an action when use a onClose method', () => {
    //TODO: could be a good idea do with TDD. This implementation is not done yet :)
  })
})
