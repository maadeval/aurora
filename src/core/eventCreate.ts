import { Toast, ToastWithoutIdAndType } from '../types/Toast'
import { ToastTypes } from '../types/ToastTypes'
import { startTimeoutToAutoDelete } from './eventHelpers'
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
    // TODO: remove this if pinned. If pinned is not necessary to set duration, timeoutId and timestamp
    const timeoutId = startTimeoutToAutoDelete({
      id,
      duration: toast.duration ?? 5000,
    })

    const event = new CustomEvent(CUSTOM_EVENT_CREATE_NAME, {
      detail: {
        ...toast,
        type,
        id,
        timestamp: Date.now(),
        timeoutId,
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
// this is internal method to set the initial status on the promise toast
const loading = (config: ToastWithoutIdAndType) =>
  emitEventCreate('loading')(config)
const custom = (config: ToastWithoutIdAndType) =>
  emitEventCreate('custom')(config) // TODO: change custom to default (?) not set styles, this is the different between custom and others
const promise = <T>(
  callback: (props?: T) => Promise<T>,
  type: CreateToastPromise<T>
) => {
  const DEFAULT_LOADING_DURATION = 10000

  const updateableToastId = loading({
    ...type.loading,
    duration: DEFAULT_LOADING_DURATION,
  })

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
