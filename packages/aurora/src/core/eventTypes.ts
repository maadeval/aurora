import { Toast, ToastWithoutIdAndType } from '../types/Toast'
import { ToastId } from '../types/ToastId'

export interface CustomEventDetail extends Event {
  detail: Toast
}

export interface CustomEventDetailOnlyId extends Event {
  detail: {
    id: ToastId
  }
}

export interface CustomEventDetailToastsList extends Event {
  detail: {
    toasts: Map<ToastId, Toast>
  }
}

export interface CreateToastPromise<T> {
  loading: ToastWithoutIdAndType
  success: ToastWithoutIdAndType | ((data: T) => ToastWithoutIdAndType)
  error: ToastWithoutIdAndType | ((data: Error) => ToastWithoutIdAndType)
}
