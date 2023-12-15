import { ReactNode } from 'react'
import { ToastPublicAPI } from './Toast'

interface BodyWithoutTitle {
  body: ReactNode | ((toast: Omit<ToastPublicAPI, 'body'>) => ReactNode)
  title?: never
}

interface TitleWithoutBody {
  title: string
  body?: never
}

interface TitleAndBody {
  title: string
  body: ReactNode | ((toast: Omit<ToastPublicAPI, 'body'>) => ReactNode)
}

export type ToastContent = TitleAndBody | TitleWithoutBody | BodyWithoutTitle
