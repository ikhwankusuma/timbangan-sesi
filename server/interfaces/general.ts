export interface Config {
  status: 'trial' | 'activated'
  name: string
  phone?: string
  email?: string
  address?: string
  password?: string
  salt?: string
  exp_date?: Date
  iat?: number
  aud?: string
  iss?: string
}