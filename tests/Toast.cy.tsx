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
      timeout: 0,
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

  it.only('should close automatic toasts by duration', () => {
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

    cy.wait(duration / 2)
    cy.get('h3', {
      timeout: 0,
    }).should('have.length', 1) // <- wait half duration and close first toast

    cy.wait(duration / 2)

    cy.get('[data-testid="toast"]', {
      timeout: 0,
    }).should('not.exist') // <- wait half duration and close second toast */
  })
})
