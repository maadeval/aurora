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

  it.only('should mantain toast open when mouse enter', () => {
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    cy.get('[data-testid="toast"]').realHover()

    cy.wait(customDuration)

    cy.get('[data-testid="toast"]').should('be.visible')
  })
})
