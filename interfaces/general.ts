export type ViewMode = 'desktop' | 'mobile'

export interface Config {
  status?: 'trial' | 'activated'
  name?: string
  phone?: string
  email?: string
  address?: string
  password?: string
  salt?: string
  exp_date?: Date
}

export interface InputSwitchOption {
  options: [string, string]
  model: string
  disabled?: boolean
}
export interface InputColorOption {
  color: string
  alpha: number
}
export interface InputToggleOption {
  model: boolean
  disabled?: boolean
}
export interface InputFileOption {
  file: File
  type?: 'any' | 'image'
  disabled?: boolean
  label?: string
  image_url?: string
  width?: number
  height?: number
}
export interface InputImageOption {
  label: string
  limit: number
  file: (File | string)[]
}
export interface InputOption {
  name: string
  placeholder: string
  model: string
  prefix?: string
  icon?: string
  color?: string
  value?: string
  label?: string
  error?: string
  type?: 'email' | 'password' | 'tel' | 'number' | 'hour' | 'minute'
  disabled?: boolean
  options?: (string | {
    name: string
    value: string
  })[]
}
export interface InputDateOption {
  name?: string
  placeholder?: string
  model: string
  value?: string
  icon?: string
  label?: string
  error?: string
  disabled?: boolean
  threshold?: Date
  available?: number[]
}
export interface InputCodeOption {
  name: string
  length: number
  model: string
  disabled?: boolean
}
export interface InputSearchOption {
  name: string
  placeholder: string
  model: string
  type?: 'primary' | 'secondary'
}
export interface InputGeneric<T> {
  name: string
  placeholder: string
  model: string
  value?: T
  icon?: string
  label?: string
  error?: string
  type?: 'email' | 'password' | 'tel' | 'number'
  disabled?: boolean
  options?: (string | {
    name: string
    value: T
  })[]
}