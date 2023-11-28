import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Toast, toast } from '../../src'
import userEvent from '@testing-library/user-event'

describe('When Create toast', () => {
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
})
