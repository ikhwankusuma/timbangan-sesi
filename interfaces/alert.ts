export interface Alert {
  type: 'error' | 'warning' | 'success'
  title: string
  message: string
}