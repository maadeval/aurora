import { Toast, ToastWithoutIdAndType } from '../types/Toast'
import { ToastTypes } from '../types/ToastTypes'
import { handleGetTimingProps } from './eventHelpers'
import { CreateToastPromise, CustomEventDetail } from './eventTypes'
import { eventUpdate } from './eventUpdate'

const CUSTOM_EVENT_CREATE_NAME = 'custom__toast__event__create'

function subscribe(callback: (toast: Toast) => void) {
  const fn = ({ detail }: CustomEventDetail) => callback(detail)
  document.addEventListener(CUSTOM_EVENT_CREATE_NAME, fn as EventListener)

  return fn
}

function unsubscribe(fn: (toast: Toast) => void) {
  document.removeEventListener(
    CUSTOM_EVENT_CREATE_NAME,
    fn as unknown as EventListener
  )
}

function emitEventCreate(type: ToastTypes) {
  return (toast: ToastWithoutIdAndType) => {
    const id = window.crypto.randomUUID()

    const timingProps = handleGetTimingProps({
      ...toast,
      id,
      type,
    })

    const event = new CustomEvent(CUSTOM_EVENT_CREATE_NAME, {
      detail: {
        ...toast,
        ...timingProps,
      },
    })

    document.dispatchEvent(event)

    return id
  }
}

const success = (config: ToastWithoutIdAndType) =>
  emitEventCreate('success')(config)
const error = (config: ToastWithoutIdAndType) =>
  emitEventCreate('error')(config)
const warning = (config: ToastWithoutIdAndType) =>
  emitEventCreate('warning')(config)
const info = (config: ToastWithoutIdAndType) => emitEventCreate('info')(config)
const loading = (config: ToastWithoutIdAndType) =>
  emitEventCreate('loading')(config)
const custom = (config: ToastWithoutIdAndType) =>
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
