import { useEffect, useState } from 'react'
import { Toast as IToast } from '../types/Toast'
import { eventCreate } from '../core/eventCreate'
import { eventUpdate } from '../core/eventUpdate'
import { ToastId } from '../types/ToastId'
import { eventDelete } from '../core/eventDelete'
import { startTimeoutToAutoDelete } from '../core/eventHelpers'

export const Toast = () => {
  const [toastState, setToastState] = useState(new Map<ToastId, IToast>())

  /* set new toast */
  useEffect(() => {
    const handleCreateToast = (toast: IToast) => {
      setToastState((prev) => {
        const newToast = new Map(prev)
        newToast.set(toast.id, toast)
        return newToast
      })
    }

    eventCreate.subscribe(handleCreateToast)

    return () => {
      eventCreate.unsubscribe(handleCreateToast)
    }
  }, [])

  /* update existing toast */
  useEffect(() => {
    const handleUpdateToast = (toast: IToast) => {
      setToastState((prev) => {
        const newToasts = new Map(prev)
        newToasts.set(toast.id, toast)
        return newToasts
      })
    }

    eventUpdate.subscribe(handleUpdateToast)

    return () => {
      eventUpdate.unsubscribe(handleUpdateToast)
    }
  }, [])

  /* delete existing toast */
  useEffect(() => {
    const handleDeleteToast = (toastId: ToastId) => {
      setToastState((prev) => {
        const newToasts = new Map(prev)
        newToasts.delete(toastId)
        return newToasts
      })
    }

    eventDelete.subscribe(handleDeleteToast)

    return () => {
      eventDelete.unsubscribe(handleDeleteToast)
    }
  }, [])

  const handlePauseAllToast = () => {
    setToastState((prev) => {
      const newToasts = new Map(prev)
      for (const [index, toast] of newToasts) {
        const hasTimeoutId = toast.timeoutId != null
        if (!hasTimeoutId) continue

        newToasts.set(index, {
          ...toast,
          timeoutId: null,
          duration: toast.duration! - (Date.now() - toast.timestamp!),
        })

        clearTimeout(toast.timeoutId!)
      }
      return newToasts
    })
  }

  const handleResumeAllToast = () => {
    setToastState((prev) => {
      const newToasts = new Map(prev)
      for (const [index, toast] of newToasts) {
        const hasTimeoutId = toast.timeoutId != null
        const hasTimestamp = toast.timestamp != null
        const hasDuration = toast.duration != null
        if (!hasTimeoutId && !hasTimestamp && !hasDuration) continue

        newToasts.set(index, {
          ...toast,
          timeoutId: startTimeoutToAutoDelete({
            id: index,
            duration: toast.duration!,
          }),
          timestamp: Date.now(),
        })
      }
      return newToasts
    })
  }

  if (toastState.size === 0) return null

  return (
    <div onMouseEnter={handlePauseAllToast} onMouseLeave={handleResumeAllToast}>
      {[...toastState].map(([index, toast]) => (
        <div key={index}>
          {toast.showCloseButton && (
            <button onClick={() => eventDelete.delete(index)}>❌</button>
          )}
          {toast.title}
          {toast.body}
        </div>
      ))}
    </div>
  )
}
