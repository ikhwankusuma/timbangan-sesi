export type UserRole = 'operator' | 'admin'

export interface UserBody {
  _id?: string
  name: string
  username: string
  password: string
  role: string
}

export interface User {
  _id: string
  name: string
  role: UserRole
}