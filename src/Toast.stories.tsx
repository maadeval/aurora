import type { Meta, StoryObj } from '@storybook/react'

import { Toast } from './Toast'
import { toastEvent } from './core/toastEvent'

const meta: Meta<typeof Toast> = {
  component: Toast,
}

export default meta
type Story = StoryObj<typeof Toast>

export const Basic: Story = {
  render: () => {
    return (
      <>
        <Toast />
        <button
          onClick={() => {
            toastEvent.emitEvent({
              type: 'info',
              title: `Info`,
              message: 'This is an info toast',
              position: 'top-center',
              icon: null,
              showClose: true,
            })
          }}
        >
          Active toast
        </button>
      </>
    )
  },
}
