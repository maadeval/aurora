import { ToastWithoutIdAndType } from '../types/Toast'
import { ToastId } from '../types/ToastId'
import { eventCreate } from './eventCreate'
import { eventUpdate } from './eventUpdate'

type UpdatedTypeConfig = 'success' | 'error' | 'warning' | 'info' | 'custom'

const { success, info, warning, error, promise, custom } = eventCreate

const update = (
  toastId: ToastId,
  type: UpdatedTypeConfig,
  config?: ToastWithoutIdAndType
) => {
  eventUpdate[type](toastId, config ?? {})
}

export const toast = {
  success,
  info,
  warning,
  error,
  promise,
  custom,
  update,
}
