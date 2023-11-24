import { ReactNode } from 'react'

type PositionX = 'left' | 'center' | 'right'
type PositionY = 'top' | 'bottom'

interface TitleWithoutMessage {
  title: string
  message?: never
}

interface MessageWithoutTitle {
  title?: never
  message: string
}

interface TitleAndMessage {
  title: string
  message: string
}

type DetailToast = {
  duration?: number
  type?: 'success' | 'error' | 'warning' | 'info'
  position?: `${PositionY}-${PositionX}`
  showClose?: boolean
  icon?: ReactNode
} & (TitleWithoutMessage | MessageWithoutTitle | TitleAndMessage)

export type DetailToastWithId = DetailToast & {
  id: `${string}-${string}-${string}-${string}-${string}`
}

type SubscribeProps = (
  callback: (detail: DetailToastWithId) => void
) => (event: (toast: DetailToastWithId) => void) => void

const subscribe: SubscribeProps = (callback) => {
  const fn = ({ detail }: CustomEvent<DetailToastWithId>) => callback(detail)

  document.addEventListener(CUSTOM_EVENT_NAME, fn)

  return fn
}

const unsubscribe = (fn: (toast: DetailToastWithId) => void) => {
  document.removeEventListener(CUSTOM_EVENT_NAME, fn)
}

const emitEvent = (toastDetail: DetailToast) => {
  const event = new CustomEvent<DetailToastWithId>(CUSTOM_EVENT_NAME, {
    detail: {
      ...toastDetail,
      id: window.crypto.randomUUID(),
    },
  })

  document.dispatchEvent(event)
}

export const toastEvent = {
  subscribe,
  unsubscribe,
  emitEvent,
}

const CUSTOM_EVENT_NAME = 'custom-toast-event'
