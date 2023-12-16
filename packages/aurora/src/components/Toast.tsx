'use client'
import { useEffect, useState } from 'react'
import { Toast as IToast } from '../types/Toast'
import { eventCreate } from '../core/eventCreate'
import { eventUpdate } from '../core/eventUpdate'
import { ToastId } from '../types/ToastId'
import { eventDelete } from '../core/eventDelete'
import { startTimeoutToAutoDelete } from '../core/eventHelpers'
import { ToastPosition } from '../types/ToastPosition'
import style from './Toast.module.css'

type Props = {
  position?: ToastPosition
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>

export const Toast = ({ position = 'bottom-right', ...props }: Props) => {
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

    return () => eventCreate.unsubscribe(handleCreateToast)
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

    return () => eventUpdate.unsubscribe(handleUpdateToast)
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

    return () => eventDelete.unsubscribe(handleDeleteToast)
  }, [])

  const handlePauseAllToast = () => {
    for (const [, toast] of toastState) {
      const hasTimeoutId = toast.timeoutId != null
      if (!hasTimeoutId) continue

      eventUpdate[
        toast.type as 'success' | 'error' | 'warning' | 'info' | 'custom'
      ](toast.id, {
        timeoutId: undefined,
        duration: toast.duration! - (Date.now() - toast.timestamp!),
      })

      clearTimeout(toast.timeoutId)
    }
  }

  const handleResumeAllToast = () => {
    for (const [index, toast] of toastState) {
      const hasTimeoutId = toast.timeoutId != null
      const hasTimestamp = toast.timestamp != null
      const hasDuration = toast.duration != null
      if (!hasTimeoutId && !hasTimestamp && !hasDuration) continue

      eventUpdate[
        toast.type as 'success' | 'error' | 'warning' | 'info' | 'custom'
      ](toast.id, {
        timeoutId: startTimeoutToAutoDelete({
          id: index,
          duration: toast.duration!,
        }),
        timestamp: Date.now(),
      })
    }
  }

  if (toastState.size === 0) return null

  return (
    <div
      {...props}
      className={style[position]}
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
          {toast.title && <h3>{toast.title}</h3>}
          {typeof toast.body === 'string' && <p>{toast.body}</p>}
          {typeof toast.body === 'function' && toast.body(toast)}
          {typeof toast.body === 'object' && toast.body}
        </div>
      ))}
    </div>
  )
}
