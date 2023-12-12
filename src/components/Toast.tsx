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

const IS_DEVELOPMENT = import.meta.env.MODE === 'development'

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

        window.clearTimeout(toast.timeoutId)
      }
      return newToasts
    })
  }

  const handleResumeAllToast = () => {
    setToastState((prev) => {
      const newToasts = new Map(prev)
      for (const [index, toast] of newToasts) {
        // check if loading or pinned
        const isLoadingType = toast.type === 'loading'
        const isPinned = toast.isPinned === true
        if (isLoadingType || isPinned || !toast.duration) continue

        newToasts.set(index, {
          ...toast,
          timeoutId: startTimeoutToAutoDelete({
            id: index,
            duration: toast.duration,
          }),
          timestamp: Date.now(),
        })
      }
      return newToasts
    })
  }

  // TODO: will apply
  // if (toastState.size === 0) return null

  return (
    <>
      {IS_DEVELOPMENT && (
        <aside
          style={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            zIndex: 9999,
            background: '#16161690',
            padding: '10px',
            borderRadius: '10px',
            color: '#fff',
          }}
        >
          {[...toastState].map(([index, toast]) => (
            <div key={index}>
              <pre>
                <code>{JSON.stringify(toast, null, 2)}</code>
              </pre>
            </div>
          ))}
        </aside>
      )}
      {toastState.size === 0 ? null : (
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
              {toast.title && <h3>{toast.title}</h3>}
              {typeof toast.body === 'string' && <p>{toast.body}</p>}
              {typeof toast.body === 'function' && toast.body(toast)}
              {typeof toast.body === 'object' && toast.body}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
