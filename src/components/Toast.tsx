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

  console.log(toastState)

  if (toastState.size === 0) return null

  return (
    <div>
      {[...toastState].map(([index, toast]) => (
        <div
          onMouseEnter={() => {
            setToastState((prev) => {
              const newToasts = new Map(prev)
              newToasts.set(index, {
                ...toast,
                timeoutId: null,
              })
              return newToasts
            })

            clearTimeout(toast.timeoutId)
          }}
          onMouseLeave={() => {
            const timeoutId = startTimeoutToAutoDelete({
              id: index,
              duration: toast.duration ?? 5000,
            })

            setToastState((prev) => {
              const newToasts = new Map(prev)
              newToasts.set(index, {
                ...toast,
                timeoutId,
              })
              return newToasts
            })
          }}
          key={index}
        >
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
