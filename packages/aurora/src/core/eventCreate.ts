import { Toast, ToastWithoutIdAndType } from '../types/Toast'
import { ToastId } from '../types/ToastId'
import { ToastTypes } from '../types/ToastTypes'
import { handleGetTimingProps } from './eventHelpers'
import { CreateToastPromise, CustomEventDetail } from './eventTypes'
import { eventUpdate } from './eventUpdate'

enum CUSTOM_EVENT_CREATE_NAME {
  NAME = 'custom__toast__event__create',
}

function subscribe(callback: (toast: Toast) => void) {
  const fn = ({ detail }: CustomEventDetail) => callback(detail)
  document.addEventListener(CUSTOM_EVENT_CREATE_NAME.NAME, fn as EventListener)

  return fn
}

function unsubscribe(fn: (toast: Toast) => void) {
  document.removeEventListener(
    CUSTOM_EVENT_CREATE_NAME.NAME,
    fn as unknown as EventListener
  )
}

function emitEventCreate(type: ToastTypes) {
  return (toast: ToastWithoutIdAndType): ToastId => {
    const id = window.crypto.randomUUID()
    // check is title and body is empty
    if (!toast.title && !toast.body)
      throw new Error('Title or body is required')

    const timingProps = handleGetTimingProps({
      ...toast,
      id,
      type,
    })

    const event = new CustomEvent(CUSTOM_EVENT_CREATE_NAME.NAME, {
      detail: {
        ...toast,
        ...timingProps,
      },
    })

    document.dispatchEvent(event)

    return id
  }
}

const success = (config: ToastWithoutIdAndType): ToastId =>
  emitEventCreate('success')(config)
const error = (config: ToastWithoutIdAndType): ToastId =>
  emitEventCreate('error')(config)
const warning = (config: ToastWithoutIdAndType): ToastId =>
  emitEventCreate('warning')(config)
const info = (config: ToastWithoutIdAndType): ToastId =>
  emitEventCreate('info')(config)
const loading = (config: ToastWithoutIdAndType): ToastId =>
  emitEventCreate('loading')(config)
const custom = (config: ToastWithoutIdAndType): ToastId =>
  emitEventCreate('custom')(config)
const promise = <T>(
  callback: (props?: T) => Promise<T>,
  type: CreateToastPromise<T>
) => {
  const updateableToastId = loading(type.loading)

  callback()
    .then((data) => {
      const successConfig =
        type.success instanceof Function ? type.success(data) : type.success

      eventUpdate.success(updateableToastId, successConfig)
    })
    .catch((err: Error) => {
      const errorConfig =
        type.error instanceof Function ? type.error(err) : type.error

      eventUpdate.error(updateableToastId, errorConfig)
    })
}

export const eventCreate = {
  subscribe,
  unsubscribe,
  success,
  error,
  warning,
  info,
  custom,
  promise,
}
