import { Toast } from '../types/Toast'
import { ToastId } from '../types/ToastId'
import { eventDelete } from './eventDelete'

export function startTimeoutToAutoDelete({
  id,
  duration,
}: {
  id: ToastId
  duration: number
}) {
  const timeoutId = window.setTimeout(() => {
    eventDelete.delete(id)
  }, duration)

  return timeoutId
}

export function handleGetTimingProps(toast: Toast) {
  const isPinned = toast.isPinned ?? false
  const isLoadingType = toast.type === 'loading'

  if (isPinned || isLoadingType) {
    return toast
  }

  const duration = toast.duration ?? DEFAULT_DURATION

  return {
    ...toast,
    duration,
    timestamp: Date.now(),
    timeoutId: startTimeoutToAutoDelete({
      id: toast.id,
      duration,
    }),
  }
}

const DEFAULT_DURATION = 5000
