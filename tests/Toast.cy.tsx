import { toast } from '../src'
import { Toast } from '../src/components/Toast'
import { mount } from 'cypress/react18'
import { ToastByTest } from './ToastByTest'

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

  it('should open differents types of toasts', () => {
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button-success'
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: 'custom body',
            })
          }
        >
          click to open toast
        </button>
        <button
          data-testid='button-warning'
          onClick={() =>
            toast.warning({
              title: 'custom title',
              body: 'custom body',
            })
          }
        >
          click to open toast
        </button>
        <button
          data-testid='button-info'
          onClick={() =>
            toast.info({
              title: 'custom title',
              body: 'custom body',
            })
          }
        >
          click to open toast
        </button>
        <button
          data-testid='button-error'
          onClick={() =>
            toast.error({
              title: 'custom title',
              body: 'custom body',
            })
          }
        >
          click to open toast
        </button>
        <button
          data-testid='button-custom'
          onClick={() =>
            toast.custom({
              title: 'custom title',
              body: 'custom body',
            })
          }
        >
          click to open toast
        </button>
        <button
          data-testid='button-promise'
          onClick={() =>
            toast.promise(
              () => new Promise((resolve) => setTimeout(resolve, 1000)),
              {
                success: {
                  title: 'custom title',
                  body: 'custom body',
                },
                loading: {
                  title: 'custom title',
                  body: 'custom body',
                },
                error: {
                  title: 'custom title',
                  body: 'custom body',
                },
              }
            )
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button-success"]').click()

    cy.get('[data-type="success"]').should('be.visible')

    cy.get('[data-testid="button-warning"]').click()

    cy.get('[data-type="warning"]').should('be.visible')

    cy.get('[data-testid="button-info"]').click()

    cy.get('[data-type="info"]').should('be.visible')

    cy.get('[data-testid="button-error"]').click()

    cy.get('[data-type="error"]').should('be.visible')

    cy.get('[data-testid="button-custom"]').click()

    cy.get('[data-type="custom"]').should('be.visible')

    cy.get('[data-testid="button-promise"]').click()

    cy.get('[data-type="loading"]').should('be.visible')
  })

  it('should change the type of toast by user action', () => {
    mount(<ToastByTest />)

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button-success"]').click()

    cy.get('[data-type="success"]').should('be.visible')

    cy.get('[data-testid="button-error"]').click()

    cy.get('[data-type="error"]').should('be.visible')
  })

  it('should close toast by click on close button', () => {
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button'
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: 'custom body',
              showCloseButton: true,
            })
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button"]').click()

    cy.get('[title="close"]').click()

    cy.get('[data-testid="toast"]').should('not.exist')
  })

  it('should pin toast by click on pin button', () => {
    mount(
      <>
        <Toast data-testid='toast' />
        <button
          data-testid='button'
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: 'custom body',
              isPinned: true,
            })
          }
        >
          click to open toast
        </button>
      </>
    )

    cy.get('[data-testid="toast"]').should('not.exist')

    cy.get('[data-testid="button"]').click()

    cy.wait(1000)

    cy.get('[data-testid="toast"]').should('be.visible')
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
