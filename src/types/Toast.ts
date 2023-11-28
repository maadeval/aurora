import { ToastContent } from './ToastContent'
import { ReactNode } from 'react'
import { ToastId } from './ToastId'
import { ToastPosition } from './ToastPosition'
import { ToastTypes } from './ToastTypes'
import { ToastCloseFunction } from './ToastCloseFunction'

export type Toast = {
  id: ToastId
  isPinned?: boolean
  icon?: ReactNode
  position?: ToastPosition
  type: ToastTypes
  showCloseButton?: boolean
  duration?: number
  onClose?: ToastCloseFunction
} & ToastContent

export type ToastWithoutId = Omit<Toast, 'id'>
export type ToastWithoutIdAndType = Omit<ToastWithoutId, 'type'>
