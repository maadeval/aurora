import { useState } from 'react'
import { ToastId } from '../src/types/ToastId'
import { Toast, toast } from '../src'

// TODO: move this to a PageObject, more beautiful :)
export const ToastByTest = () => {
  const [toastId, setToastId] = useState<ToastId | undefined>()
  return (
    <>
      <Toast data-testid='toast' />
      <button
        data-testid='button-success'
        onClick={() => {
          const id = toast.success({
            title: 'custom title',
            body: 'custom body',
          })

          setToastId(id)
        }}
      >
        click to open toast
      </button>
      <button
        data-testid='button-error'
        onClick={() => {
          if (!toastId) return
          toast.update(toastId, 'error')
        }}
      >
        click to change type
      </button>
    </>
  )
}
