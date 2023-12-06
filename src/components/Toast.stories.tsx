import type { Meta, StoryObj } from '@storybook/react'

import { Toast } from './Toast'
import { toast } from '../index'
import { eventCreate } from '../core/eventCreate'
import { useState } from 'react'
import { ToastId } from '../types/ToastId'

const meta: Meta<typeof Toast> = {
  component: Toast,
}

const examplePromise = (): Promise<{
  title: string
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: 'Promesa resuela! 🚀',
      })
    }, 5000)
  })
}

const getUsers = () => {
  return fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then((res) => (res.ok ? res : Promise.reject(res)))
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export default meta
type Story = StoryObj<typeof Toast>

export const Success: Story = {
  render: () => {
    return (
      <>
        <Toast />
        <button
          onClick={() => {
            eventCreate.success({
              body: 'success',
            })
          }}
        >
          Active toast
        </button>
      </>
    )
  },
}

interface Data {
  title: string
}

export const Basic: Story = {
  render: () => {
    return (
      <>
        <Toast />
        <button
          onClick={() => {
            eventCreate.promise<Data>(getUsers, {
              error: {
                title: 'Error',
              },
              success: (data) => ({
                title: `Success ${data.title ?? ''}`,
                duration: 15000,
              }),
              loading: {
                title: 'Loading',
              },
            })
          }}
        >
          Active toast
        </button>
      </>
    )
  },
}

export const All: Story = {
  render: () => {
    return (
      <>
        <Toast />
        <button
          onClick={() =>
            eventCreate.success({
              title: 'success action',
              showCloseButton: true,
              duration: 15000,
            })
          }
        >
          success
        </button>
        <button
          onClick={() =>
            eventCreate.error({
              title: 'error action',
              showCloseButton: true,
              duration: 15000,
            })
          }
        >
          error
        </button>
        <button
          onClick={() =>
            eventCreate.info({
              title: 'info action',
              showCloseButton: true,
            })
          }
        >
          info
        </button>
        <button
          onClick={() => {
            eventCreate.promise<Data>(examplePromise, {
              error: {
                title: 'Error',
                showCloseButton: true,
              },
              success: (data) => ({
                title: `Success ${data.title ?? ''}`,
                duration: 15000,
                showCloseButton: true,
              }),
              loading: {
                title: 'Loading',
              },
            })
          }}
        >
          Active toast
        </button>
      </>
    )
  },
}

export const Changed: Story = {
  render: Component,
}

function Component() {
  const [toastId, setToastId] = useState<ToastId | undefined>()
  return (
    <>
      <Toast data-testid='toast' />
      <button
        data-testid='button'
        onClick={() => {
          const id = toast.success({
            title: 'custom title',
            body: 'custom body',
            isPinned: true,
          })

          setToastId(id)
        }}
      >
        click to open toast
      </button>
      <button
        onClick={() => {
          if (!toastId) return
          toast.update(toastId, 'error', {
            title: 'this is an error now',
          })
        }}
      >
        click to change type
      </button>
    </>
  )
}
