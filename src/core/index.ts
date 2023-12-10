import { ToastWithoutIdAndType } from '../types/Toast'
import { ToastId } from '../types/ToastId'
import { eventCreate } from './eventCreate'
import { eventDelete } from './eventDelete'
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

const _delete = (toastId: ToastId) => {
  eventDelete.delete(toastId)
}

export const toast = {
  success,
  info,
  warning,
  error,
  promise,
  custom,
  update,
  delete: _delete,
}
