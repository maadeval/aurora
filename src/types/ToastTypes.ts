export type ToastTypes =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'custom'
  | 'loading'
  | 'promise'

export type ToastTypesWithoutPromise = Exclude<ToastTypes, 'promise'>
