export interface ToastProps {
  text: string
}

export const Toast = ({ text }: ToastProps) => {
  return <div>{text}</div>
}
