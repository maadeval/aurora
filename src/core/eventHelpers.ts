import { ToastId } from '../types/ToastId'
import { eventDelete } from './eventDelete'

export function startTimeoutToAutoDelete({
  id,
  duration,
}: {
  id: ToastId
  duration: number
}) {
  const timeoutId = setTimeout(() => {
    eventDelete.delete(id)
  }, duration ?? 5000)

  return timeoutId
}
