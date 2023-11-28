import { Toast, ToastWithoutIdAndType } from '../types/Toast'
import { ToastId } from '../types/ToastId'
import { ToastTypesWithoutPromise } from '../types/ToastTypes'
import { CustomEventDetail } from './eventTypes'

const CUSTOM_EVENT_UPDATE_NAME = 'custom__toast__event__update'

function subscribe(callback: (toast: Toast) => void) {
  const fn = ({ detail }: CustomEventDetail) => callback(detail)
  document.addEventListener(CUSTOM_EVENT_UPDATE_NAME, fn as EventListener)

  return fn
}

function unsubscribe(fn: (toast: Toast) => void) {
  document.removeEventListener(
    CUSTOM_EVENT_UPDATE_NAME,
    fn as unknown as EventListener
  )
}

function emitEventUpdate(type: ToastTypesWithoutPromise) {
  return (id: ToastId, config: ToastWithoutIdAndType) => {
    const event = new CustomEvent(CUSTOM_EVENT_UPDATE_NAME, {
      detail: {
        ...config,
        type,
        id,
      },
    })

    document.dispatchEvent(event)
  }
}

const success = (id: ToastId, config: ToastWithoutIdAndType) =>
  emitEventUpdate('success')(id, config)
const error = (id: ToastId, config: ToastWithoutIdAndType) =>
  emitEventUpdate('error')(id, config)
const warning = (id: ToastId, config: ToastWithoutIdAndType) =>
  emitEventUpdate('warning')(id, config)
const info = (id: ToastId, config: ToastWithoutIdAndType) =>
  emitEventUpdate('info')(id, config)
const custom = (id: ToastId, config: ToastWithoutIdAndType) =>
  emitEventUpdate('custom')(id, config)
const loading = (id: ToastId, config: ToastWithoutIdAndType) =>
  emitEventUpdate('loading')(id, config)

export const eventUpdate = {
  subscribe,
  unsubscribe,
  success,
  error,
  warning,
  info,
  custom,
  loading,
}
