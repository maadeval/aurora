'use client'
import { useEffect, useState } from 'react'
import { Toast as IToast } from '../types/Toast'
import { eventCreate } from '../core/eventCreate'
import { eventUpdate } from '../core/eventUpdate'
import { ToastId } from '../types/ToastId'
import { eventDelete } from '../core/eventDelete'
import { startTimeoutToAutoDelete } from '../core/eventHelpers'

type Props = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onMouseEnter' | 'onMouseLeave'
>

export const Toast = (props: Props) => {
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
        const newToast = new Map(prev)

        // if loading (private state used on promises) reset all toast config and set new
        // if not loading, is because is a public update, so we need to merge the new config with the old one
        const isLoadingType = toast.type === 'loading'
        const newToastConfig = isLoadingType
          ? toast
          : {
              ...prev.get(toast.id),
              ...toast,
            }

        newToast.set(toast.id, newToastConfig)
        return newToast
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
          timeoutId: undefined,
          duration: toast.duration! - (Date.now() - toast.timestamp!),
        })

        clearTimeout(toast.timeoutId)
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
    <div
      {...props}
      onMouseEnter={handlePauseAllToast}
      onMouseLeave={handleResumeAllToast}
    >
      {[...toastState].map(([index, toast]) => (
        <div data-type={toast.type} key={index}>
          {toast.showCloseButton && (
            <button title='close' onClick={() => eventDelete.delete(index)}>
              ❌
            </button>
          )}
          <h3>{toast.title}</h3>
          <p>{toast.body}</p>
        </div>
      ))}
    </div>
  )
}
