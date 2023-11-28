import { Toast } from './Toast'

export interface ToastCloseFunction {
  onClose: (toast: Omit<Toast, 'onClose'>) => void
}
