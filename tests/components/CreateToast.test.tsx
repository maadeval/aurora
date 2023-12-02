import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Toast, toast } from '../../src'
import userEvent from '@testing-library/user-event'

describe('When create toast', () => {
  it('should render correctly with title', async () => {
    const customTitle = 'custom title'
    render(
      <>
        <Toast />
        <button
          onClick={() =>
            toast.success({
              title: customTitle,
            })
          }
        >
          create toast
        </button>
      </>
    )

    const button = screen.getByRole('button', {
      name: /create toast/i,
    })

    expect(screen.queryByTitle(customTitle)).not.toBeInTheDocument()

    await userEvent.click(button)

    expect(
      screen.getByRole('heading', {
        name: customTitle,
      })
    ).toBeInTheDocument()
  })

  it('should render correctly with body', async () => {
    const customBody = 'custom body'
    render(
      <>
        <Toast />
        <button
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: customBody,
            })
          }
        >
          create toast
        </button>
      </>
    )

    const button = screen.getByRole('button', {
      name: /create toast/i,
    })

    expect(screen.queryByText(customBody)).not.toBeInTheDocument()

    await userEvent.click(button)

    expect(screen.getByText(customBody)).toBeInTheDocument()
  })

  it('should throw an error if title and body is empty', () => {
    expect(() =>
      toast.success({
        body: '',
      })
    ).toThrowError('Title or body is required')
  })

  it('should show and hide toast before time', async () => {
    render(
      <>
        <Toast />
        <button
          onClick={() =>
            toast.success({
              title: 'custom title',
              body: 'custom body',
              duration: 1000,
            })
          }
        >
          timer
        </button>
      </>
    )

    const headingOfToast = screen.queryByRole('heading', {
      name: /custom title/i,
    })

    expect(headingOfToast).not.toBeInTheDocument()

    const button = screen.getByRole('button', {
      name: /timer/i,
    })

    await userEvent.click(button)

    expect(
      await screen.findByRole('heading', {
        name: /custom title/i,
      })
    ).toBeInTheDocument()

    vi.useFakeTimers()
    expect(headingOfToast).not.toBeInTheDocument()
    vi.useRealTimers()
  })
})
