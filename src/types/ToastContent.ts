import { ReactNode } from 'react'

interface BodyWithoutTitle {
  body: ReactNode
  title?: never
}

interface TitleWithoutBody {
  title: string
  body?: never
}

interface TitleAndBody {
  title: string
  body: ReactNode
}

export type ToastContent = TitleAndBody | TitleWithoutBody | BodyWithoutTitle
