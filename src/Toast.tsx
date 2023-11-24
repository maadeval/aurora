import { useCallback, useEffect, useMemo, useState } from 'react'
import { toastEvent } from './core/toastEvent'
import { type DetailToastWithId } from './core/toastEvent'

const data = {
  toastsList: [],
  timers: [
    {
      id: 'dsds',
      duration: 3000,
    },
  ],
}

export const Toast = () => {
  const [toastState, setToastState] = useState<DetailToastWithId[]>([])

  useEffect(() => {
    const handleToast = (toast: DetailToastWithId) => {
      const toastToSave = {
        ...toast,
        timeout() {
          setTimeout(() => {
            setToastState((lastToasts) =>
              lastToasts.filter((lastToast) => lastToast.id !== this.id)
            )
          }, this.duration ?? 3000)
        },
      }
      setToastState((lastToasts) => [...lastToasts, toastToSave])
      toastToSave.timeout()
    }

    toastEvent.subscribe(handleToast)

    return () => toastEvent.unsubscribe(handleToast)
  }, [])

  return (
    <div>
      {toastState.map((toast, index) => (
        <div key={index}>
          {toast.title}
          {toast.message}
        </div>
      ))}
    </div>
  )
}
