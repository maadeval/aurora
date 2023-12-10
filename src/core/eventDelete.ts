import { ToastId } from '../types/ToastId'
import { CustomEventDetailOnlyId } from './eventTypes'

const CUSTOM_EVENT_DELETE_NAME = 'custom__toast__event__delete'

function subscribe(callback: (toast: ToastId) => void) {
  const fn = ({ detail }: CustomEventDetailOnlyId) => callback(detail.id)
  document.addEventListener(CUSTOM_EVENT_DELETE_NAME, fn as EventListener)

  return fn
}

function unsubscribe(fn: (toast: ToastId) => void) {
  document.removeEventListener(
    CUSTOM_EVENT_DELETE_NAME,
    fn as unknown as EventListener
  )
}

function emitEventDelete(id: ToastId) {
  const event = new CustomEvent(CUSTOM_EVENT_DELETE_NAME, {
    detail: {
      id,
    },
  })

  document.dispatchEvent(event)

  return id
}

const deleteToast = (id: ToastId) => emitEventDelete(id)

export const eventDelete = {
  subscribe,
  unsubscribe,
  emitEventDelete,
  delete: deleteToast,
}
